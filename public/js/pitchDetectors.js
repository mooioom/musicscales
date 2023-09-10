var amd = [];

class PitchDetectors {

    constructor( s = {} ) {

        this.sampleRate = s.sampleRate || 48000;

    }

    Yin(float32AudioBuffer) {

        const threshold = 0.1;
        const sampleRate = this.sampleRate;
        const probabilityThreshold = 0.1;

        // Set buffer size to the highest power of two below the provided buffer's length.
        let bufferSize;
        for (bufferSize = 1; bufferSize < float32AudioBuffer.length; bufferSize *= 2);
        bufferSize /= 2;

        // Set up the yinBuffer as described in step one of the YIN paper.
        const yinBufferLength = bufferSize / 2;
        const yinBuffer = new Float32Array(yinBufferLength);

        let probability = 0,
            tau;

        // Compute the difference function as described in step 2 of the YIN paper.
        for (let t = 0; t < yinBufferLength; t++) {
            yinBuffer[t] = 0;
        }
        for (let t = 1; t < yinBufferLength; t++) {
            for (let i = 0; i < yinBufferLength; i++) {
                const delta = float32AudioBuffer[i] - float32AudioBuffer[i + t];
                yinBuffer[t] += delta * delta;
            }
        }

        // Compute the cumulative mean normalized difference as described in step 3 of the paper.
        yinBuffer[0] = 1;
        yinBuffer[1] = 1;
        let runningSum = 0;
        for (let t = 1; t < yinBufferLength; t++) {
            runningSum += yinBuffer[t];
            yinBuffer[t] *= t / runningSum;
        }

        // Compute the absolute threshold as described in step 4 of the paper.
        // Since the first two positions in the array are 1,
        // we can start at the third position.
        for (tau = 2; tau < yinBufferLength; tau++) {
            if (yinBuffer[tau] < threshold) {
                while (tau + 1 < yinBufferLength && yinBuffer[tau + 1] < yinBuffer[tau]) {
                    tau++;
                }
                // found tau, exit loop and return
                // store the probability
                // From the YIN paper: The threshold determines the list of
                // candidates admitted to the set, and can be interpreted as the
                // proportion of aperiodic power tolerated
                // within a periodic signal.
                //
                // Since we want the periodicity and and not aperiodicity:
                // periodicity = 1 - aperiodicity
                probability = 1 - yinBuffer[tau];
                break;
            }
        }

        // if no pitch found, return null.
        if (tau === yinBufferLength || yinBuffer[tau] >= threshold) {
            return null;
        }

        // If probability too low, return -1.
        if (probability < probabilityThreshold) {
            return null;
        }

        /**
         * Implements step 5 of the AUBIO_YIN paper. It refines the estimated tau
         * value using parabolic interpolation. This is needed to detect higher
         * frequencies more precisely. See http://fizyka.umk.pl/nrbook/c10-2.pdf and
         * for more background
         * http://fedc.wiwi.hu-berlin.de/xplore/tutorials/xegbohtmlnode62.html
         */
        let betterTau, x0, x2;
        if (tau < 1) {
            x0 = tau;
        } else {
            x0 = tau - 1;
        }
        if (tau + 1 < yinBufferLength) {
            x2 = tau + 1;
        } else {
            x2 = tau;
        }
        if (x0 === tau) {
            if (yinBuffer[tau] <= yinBuffer[x2]) {
                betterTau = tau;
            } else {
                betterTau = x2;
            }
        } else if (x2 === tau) {
            if (yinBuffer[tau] <= yinBuffer[x0]) {
                betterTau = tau;
            } else {
                betterTau = x0;
            }
        } else {
            const s0 = yinBuffer[x0];
            const s1 = yinBuffer[tau];
            const s2 = yinBuffer[x2];
            // fixed AUBIO implementation, thanks to Karl Helgason:
            // (2.0f * s1 - s2 - s0) was incorrectly multiplied with -1
            betterTau = tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
        }

        return sampleRate / betterTau;

    }

    Macleod(float32AudioBuffer) {
        const bufferSize = 1024;
        const cutoff = 0.97;
        const sampleRate = this.sampleRate;

        const SMALL_CUTOFF = 0.5;
        const LOWER_PITCH_CUTOFF = 80;
        const nsdf = new Float32Array(bufferSize);
        const squaredBufferSum = new Float32Array(bufferSize);

        let turningPointX;
        let turningPointY;

        let maxPositions = [];
        let periodEstimates = [];
        let ampEstimates = [];

        function normalizedSquareDifference(float32AudioBuffer) {
            let acf;
            let divisorM;
            squaredBufferSum[0] = float32AudioBuffer[0] * float32AudioBuffer[0];
            for (let i = 1; i < float32AudioBuffer.length; i += 1) {
                squaredBufferSum[i] =
                    float32AudioBuffer[i] * float32AudioBuffer[i] + squaredBufferSum[i - 1];
            }
            for (let tau = 0; tau < float32AudioBuffer.length; tau++) {
                acf = 0;
                divisorM =
                    squaredBufferSum[float32AudioBuffer.length - 1 - tau] +
                    squaredBufferSum[float32AudioBuffer.length - 1] -
                    squaredBufferSum[tau];
                for (let i = 0; i < float32AudioBuffer.length - tau; i++) {
                    acf += float32AudioBuffer[i] * float32AudioBuffer[i + tau];
                }
                nsdf[tau] = (2 * acf) / divisorM;
            }
        }

        function parabolicInterpolation(tau) {
            const nsdfa = nsdf[tau - 1],
                nsdfb = nsdf[tau],
                nsdfc = nsdf[tau + 1],
                bValue = tau,
                bottom = nsdfc + nsdfa - 2 * nsdfb;
            if (bottom === 0) {
                turningPointX = bValue;
                turningPointY = nsdfb;
            } else {
                const delta = nsdfa - nsdfc;
                turningPointX = bValue + delta / (2 * bottom);
                turningPointY = nsdfb - (delta * delta) / (8 * bottom);
            }
        }

        function peakPicking() {
            let pos = 0;
            let curMaxPos = 0;

            // find the first negative zero crossing.
            while (pos < (nsdf.length - 1) / 3 && nsdf[pos] > 0) {
                pos++;
            }

            // loop over all the values below zero.
            while (pos < nsdf.length - 1 && nsdf[pos] <= 0) {
                pos++;
            }

            // can happen if output[0] is NAN
            if (pos == 0) {
                pos = 1;
            }

            while (pos < nsdf.length - 1) {
                if (nsdf[pos] > nsdf[pos - 1] && nsdf[pos] >= nsdf[pos + 1]) {
                    if (curMaxPos == 0) {
                        // the first max (between zero crossings)
                        curMaxPos = pos;
                    } else if (nsdf[pos] > nsdf[curMaxPos]) {
                        // a higher max (between the zero crossings)
                        curMaxPos = pos;
                    }
                }
                pos++;
                // a negative zero crossing
                if (pos < nsdf.length - 1 && nsdf[pos] <= 0) {
                    // if there was a maximum add it to the list of maxima
                    if (curMaxPos > 0) {
                        maxPositions.push(curMaxPos);
                        curMaxPos = 0; // clear the maximum position, so we start
                        // looking for a new ones
                    }
                    while (pos < nsdf.length - 1 && nsdf[pos] <= 0) {
                        pos++; // loop over all the values below zero
                    }
                }
            }
            if (curMaxPos > 0) {
                maxPositions.push(curMaxPos);
            }
        }

        let pitch;
        maxPositions = [];
        periodEstimates = [];
        ampEstimates = [];

        // 1. Calculute the normalized square difference for each Tau value.
        normalizedSquareDifference(float32AudioBuffer);
        // 2. Peak picking time: time to pick some peaks.
        peakPicking();

        let highestAmplitude = -Infinity;

        for (let i = 0; i < maxPositions.length; i++) {
            const tau = maxPositions[i];
            // make sure every annotation has a probability attached
            highestAmplitude = Math.max(highestAmplitude, nsdf[tau]);

            if (nsdf[tau] > SMALL_CUTOFF) {
                // calculates turningPointX and Y
                parabolicInterpolation(tau);
                // store the turning points
                ampEstimates.push(turningPointY);
                periodEstimates.push(turningPointX);
                // remember the highest amplitude
                highestAmplitude = Math.max(highestAmplitude, turningPointY);
            }
        }

        if (periodEstimates.length) {
            // use the overall maximum to calculate a cutoff.
            // The cutoff value is based on the highest value and a relative
            // threshold.
            const actualCutoff = cutoff * highestAmplitude;
            let periodIndex = 0;

            for (let i = 0; i < ampEstimates.length; i++) {
                if (ampEstimates[i] >= actualCutoff) {
                    periodIndex = i;
                    break;
                }
            }

            const period = periodEstimates[periodIndex],
                pitchEstimate = sampleRate / period;

            if (pitchEstimate > LOWER_PITCH_CUTOFF) {
                pitch = pitchEstimate;
            } else {
                pitch = -1;
            }
        } else {
            // no pitch detected.
            pitch = -1;
        }

        return pitch;

        return {
            probability: highestAmplitude,
            freq: pitch,
        };

    }

    AMDFDetector(float32AudioBuffer) {

        const sampleRate = this.sampleRate;
        const minFrequency = 82;
        const maxFrequency = 1000;
        const sensitivity = 0.1;
        const ratio = 5;

        /* Round in such a way that both exact minPeriod as 
        exact maxPeriod lie inside the rounded span minPeriod-maxPeriod,
        thus ensuring that minFrequency and maxFrequency can be found
        even in edge cases */
        const maxPeriod = Math.ceil(sampleRate / minFrequency);
        const minPeriod = Math.floor(sampleRate / maxFrequency);

        const maxShift = float32AudioBuffer.length;

        let t = 0;
        let minval = Infinity;
        let maxval = -Infinity;
        let frames1, frames2, calcSub, i, j, u, aux1, aux2;

        // Find the average magnitude difference for each possible period offset.
        for (i = 0; i < maxShift; i++) {
            if (minPeriod <= i && i <= maxPeriod) {
                for (
                    aux1 = 0, aux2 = i, t = 0, frames1 = [], frames2 = []; aux1 < maxShift - i; t++, aux2++, aux1++
                ) {
                    frames1[t] = float32AudioBuffer[aux1];
                    frames2[t] = float32AudioBuffer[aux2];
                }

                // Take the difference between these frames.
                const frameLength = frames1.length;
                calcSub = [];
                for (u = 0; u < frameLength; u++) {
                    calcSub[u] = frames1[u] - frames2[u];
                }

                // Sum the differences.
                let summation = 0;
                for (u = 0; u < frameLength; u++) {
                    summation += Math.abs(calcSub[u]);
                }
                amd[i] = summation;
            }
        }

        for (j = minPeriod; j < maxPeriod; j++) {
            if (amd[j] < minval) minval = amd[j];
            if (amd[j] > maxval) maxval = amd[j];
        }

        const cutoff = Math.round(sensitivity * (maxval - minval) + minval);
        for (j = minPeriod; j <= maxPeriod && amd[j] > cutoff; j++);

        const searchLength = minPeriod / 2;
        minval = amd[j];
        let minpos = j;
        for (i = j - 1; i < j + searchLength && i <= maxPeriod; i++) {
            if (amd[i] < minval) {
                minval = amd[i];
                minpos = i;
            }
        }

        if (Math.round(amd[minpos] * ratio) < maxval) {
            return sampleRate / minpos;
        } else {
            return null;
        }
    }

    DynamicWaveletDetector(float32AudioBuffer) {

        const sampleRate = this.sampleRate;
        const MAX_FLWT_LEVELS = 6;
        const MAX_F = 3000;
        const DIFFERENCE_LEVELS_N = 3;
        const MAXIMA_THRESHOLD_RATIO = 0.75;

        const mins = [];
        const maxs = [];
        const bufferLength = float32AudioBuffer.length;

        let freq = null;
        let theDC = 0;
        let minValue = 0;
        let maxValue = 0;

        // Compute max amplitude, amplitude threshold, and the DC.
        for (let i = 0; i < bufferLength; i++) {
            const sample = float32AudioBuffer[i];
            theDC = theDC + sample;
            maxValue = Math.max(maxValue, sample);
            minValue = Math.min(minValue, sample);
        }

        theDC /= bufferLength;
        minValue -= theDC;
        maxValue -= theDC;
        const amplitudeMax = maxValue > -1 * minValue ? maxValue : -1 * minValue;
        const amplitudeThreshold = amplitudeMax * MAXIMA_THRESHOLD_RATIO;

        // levels, start without downsampling...
        let curLevel = 0;
        let curModeDistance = -1;
        let curSamNb = float32AudioBuffer.length;
        let delta, nbMaxs, nbMins;

        // Search:
        while (true) {
            delta = ~~(sampleRate / (Math.pow(2, curLevel) * MAX_F));
            if (curSamNb < 2) break;

            let dv;
            let previousDV = -1000;
            let lastMinIndex = -1000000;
            let lastMaxIndex = -1000000;
            let findMax = false;
            let findMin = false;

            nbMins = 0;
            nbMaxs = 0;

            for (let i = 2; i < curSamNb; i++) {
                const si = float32AudioBuffer[i] - theDC;
                const si1 = float32AudioBuffer[i - 1] - theDC;

                if (si1 <= 0 && si > 0) findMax = true;
                if (si1 >= 0 && si < 0) findMin = true;

                // min or max ?
                dv = si - si1;

                if (previousDV > -1000) {
                    if (findMin && previousDV < 0 && dv >= 0) {
                        // minimum
                        if (Math.abs(si) >= amplitudeThreshold) {
                            if (i > lastMinIndex + delta) {
                                mins[nbMins++] = i;
                                lastMinIndex = i;
                                findMin = false;
                            }
                        }
                    }

                    if (findMax && previousDV > 0 && dv <= 0) {
                        // maximum
                        if (Math.abs(si) >= amplitudeThreshold) {
                            if (i > lastMaxIndex + delta) {
                                maxs[nbMaxs++] = i;
                                lastMaxIndex = i;
                                findMax = false;
                            }
                        }
                    }
                }
                previousDV = dv;
            }

            if (nbMins === 0 && nbMaxs === 0) {
                // No best distance found!
                break;
            }

            let d;
            const distances = [];

            for (let i = 0; i < curSamNb; i++) {
                distances[i] = 0;
            }

            for (let i = 0; i < nbMins; i++) {
                for (let j = 1; j < DIFFERENCE_LEVELS_N; j++) {
                    if (i + j < nbMins) {
                        d = Math.abs(mins[i] - mins[i + j]);
                        distances[d] += 1;
                    }
                }
            }

            let bestDistance = -1;
            let bestValue = -1;

            for (let i = 0; i < curSamNb; i++) {
                let summed = 0;
                for (let j = -1 * delta; j <= delta; j++) {
                    if (i + j >= 0 && i + j < curSamNb) {
                        summed += distances[i + j];
                    }
                }

                if (summed === bestValue) {
                    if (i === 2 * bestDistance) {
                        bestDistance = i;
                    }
                } else if (summed > bestValue) {
                    bestValue = summed;
                    bestDistance = i;
                }
            }

            // averaging
            let distAvg = 0;
            let nbDists = 0;
            for (let j = -delta; j <= delta; j++) {
                if (bestDistance + j >= 0 && bestDistance + j < bufferLength) {
                    const nbDist = distances[bestDistance + j];
                    if (nbDist > 0) {
                        nbDists += nbDist;
                        distAvg += (bestDistance + j) * nbDist;
                    }
                }
            }

            // This is our mode distance.
            distAvg /= nbDists;

            // Continue the levels?
            if (curModeDistance > -1) {
                if (Math.abs(distAvg * 2 - curModeDistance) <= 2 * delta) {
                    // two consecutive similar mode distances : ok !
                    freq = sampleRate / (Math.pow(2, curLevel - 1) * curModeDistance);
                    break;
                }
            }

            // not similar, continue next level;
            curModeDistance = distAvg;

            curLevel++;
            if (curLevel >= MAX_FLWT_LEVELS || curSamNb < 2) {
                break;
            }

            //do not modify original audio buffer, make a copy buffer, if
            //downsampling is needed (only once).
            let newFloat32AudioBuffer = float32AudioBuffer.subarray(0);
            if (curSamNb === distances.length) {
                newFloat32AudioBuffer = new Float32Array(curSamNb / 2);
            }
            for (let i = 0; i < curSamNb / 2; i++) {
                newFloat32AudioBuffer[i] =
                    (float32AudioBuffer[2 * i] + float32AudioBuffer[2 * i + 1]) / 2;
            }
            float32AudioBuffer = newFloat32AudioBuffer;
            curSamNb /= 2;
        }

        return freq;

    }
}

return new PitchDetectors;