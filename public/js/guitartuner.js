export default class GuitarTuner {
    constructor() {
        this.audioContext = new(window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.gainNode = this.audioContext.createGain();
        this.microphoneStream = null;
        this.currentNote = null;
        this.tolerance = 5;
        this.notes = this.generateNotes();
    }

    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            this.microphoneStream = this.audioContext.createMediaStreamSource(stream);
            this.microphoneStream.connect(this.analyser);
            this.analyser.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            this.updatePitch();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    }

    stop() {
        if (this.microphoneStream) {
            this.microphoneStream.disconnect();
            this.analyser.disconnect();
            this.gainNode.disconnect();
            this.microphoneStream = null;
        }
    }

    updatePitch() {
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        this.analyser.getFloatTimeDomainData(dataArray);
        const pitch = this.autoCorrelate(dataArray, this.audioContext.sampleRate);

        if (pitch !== -1) {
            const closestNote = this.getClosestNoteName(pitch);
            const cents = this.getCentsOff(pitch, closestNote.frequency);
            this.currentNote = {
                name: closestNote.name,
                frequency: closestNote.frequency,
                cents,
            };
            console.log(this.currentNote); // You can handle the note data as per your needs
        }

        requestAnimationFrame(() => this.updatePitch());
    }

    autoCorrelate(buffer, sampleRate) {
        const SIZE = buffer.length;
        const MAX_SAMPLES = Math.floor(SIZE / 2);
        const MIN_SAMPLES = 0;
        const THRESHOLD = 0.2;
        let bestOffset = -1;
        let bestCorrelation = 0;
        let rms = 0;
        let foundGoodCorrelation = false;
        let correlations = new Array(MAX_SAMPLES);

        for (let i = 0; i < SIZE; i++) {
            const val = buffer[i];
            rms += val * val;
        }

        rms = Math.sqrt(rms / SIZE);

        if (rms < THRESHOLD) {
            return -1; // Not enough signal
        }

        let lastCorrelation = 1;

        for (let offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
            let correlation = 0;

            for (let i = 0; i < MAX_SAMPLES; i++) {
                correlation += Math.abs(buffer[i] - buffer[i + offset]);
            }

            correlation = 1 - correlation / MAX_SAMPLES;
            correlations[offset] = correlation;

            if (correlation > 0.9 && correlation > lastCorrelation) {
                foundGoodCorrelation = true;

                if (correlation > bestCorrelation) {
                    bestCorrelation = correlation;
                    bestOffset = offset;
                }
            } else if (foundGoodCorrelation) {
                const shift =
                    (correlations[bestOffset + 1] - correlations[bestOffset - 1]) /
                    correlations[bestOffset];
                return sampleRate / (bestOffset + 8 * shift);
            }

            lastCorrelation = correlation;
        }

        if (bestCorrelation > 0.01) {
            return sampleRate / bestOffset;
        }

        return -1;
    }

    getClosestNoteName(frequency) {
        let minDiff = Infinity;
        let closestNote = null;

        for (const note of this.notes) {
            const diff = Math.abs(frequency - note.frequency);

            if (diff < minDiff) {
                minDiff = diff;
                closestNote = note;
            }
        }

        return closestNote;
    }

    getCentsOff(frequency, targetFrequency) {
        const cents = Math.floor(1200 * Math.log2(frequency / targetFrequency));

        return cents;
    }

    generateNotes() {
        const referenceFrequency = 440; // A4 reference frequency in Hz
        const semitoneCount = 12; // 12 semitones in an octave
        const notes = [];

        for (let semitone = 0; semitone < semitoneCount; semitone++) {
            const noteIndex = semitone - 9;
            const noteName = this.getNoteName(noteIndex);
            const frequency = referenceFrequency * Math.pow(2, semitone / semitoneCount);

            notes.push({
                name: noteName,
                frequency
            });
        }

        return notes;
    }

    getNoteName(noteIndex) {
        const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
        const octave = Math.floor((noteIndex + 9) / 12);
        const noteName = noteNames[noteIndex % 12];
        return `${noteName}${octave}`;
    }
}

// Example usage:
// const tuner = new GuitarTuner();
// tuner.start(); // Start the tuner
// tuner.stop(); // Stop the tuner