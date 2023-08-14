import * as CONSTANTS from './constants.js';
import './teoria.js';

const INSTRUMENT_TYPES = {
    SAMPLER: 'SAMPLER',
    SYNTH: 'SYNTH',
}

class Metronome {
    constructor(nigun) {
        this.metronomeNodes = [];
        this.nigun = nigun;
        this.gainNode = this.nigun.context.createGain();
        this.gainNode.gain.value = this.nigun.settings.gain;
        this.gainNode.connect(this.nigun.compressor);
    }
    create() {

        let time = this.nigun.context.currentTime;

        for (let x = 0; x < (this.nigun.getTimelineDuration() / this.nigun.settings.bpm); x++) {

            let bar = x + 1;

            const node = this.nigun.context.createBufferSource();
            node.buffer = this.nigun._metronome.audioBuffer;

            if (bar % this.nigun.bars === 0) {
                node.playbackRate.value = 0.9;
            }

            node.connect(this.gainNode);
            node.start(time);

            this.metronomeNodes.push(node);

            const timePerBeat = this.nigun.getMsPerBeat() / 1000

            time += timePerBeat;

            node.stop(time - (timePerBeat / 2));

        }

    }
    stop() {
        this.metronomeNodes.forEach(node => {
            node.stop()
        });
        this.metronomeNodes = [];
    }
}

class Instrument {
    constructor(nigun, settings = {}) {

        this.nigun = nigun;
        this.context = nigun.context;
        this.settings = settings;

        this.name = settings.name;

        this.gainNode = this.context.createGain();
        this.gainNode.gain.value = settings.gain || 1;
        this.gainNode.connect(nigun.masterGain);

        this.type = settings.type || INSTRUMENT_TYPES.SYNTH;

    }

}

class Synth extends Instrument {
    constructor(nigun, settings = {}) {
        settings.type = INSTRUMENT_TYPES.SYNTH;
        super(nigun, settings);
        this.DEFAULT_OSCILLATOR_TYPE = CONSTANTS.OSCILLATOR_TYPES.TRIANGLE;
        this.oscillatorType = settings.oscillatorType || this.DEFAULT_OSCILLATOR_TYPE;
        this.oscillatorRelease = settings.oscillatorRelease || 0.1;
        this.createChannels();
    }

    async createChannels() {

        this.channels = [];

        for (let x = 0; x < this.NUM_CHANNELS; x++) {

            let gainNode = this.nigun.context.createGain();
            gainNode.gain.value = 0;
            gainNode.connect(this.gainNode);

            let oscillator = this.nigun.context.createOscillator();
            oscillator.connect(gainNode);
            oscillator.type = this.oscillatorType;

            oscillator.frequency.value = 0;

            oscillator.start();

            this.channels.push({
                gainNode,
                oscillator,
            })

        }

    }

    startFrequency(fq) {
        if (!fq) return;
        const context = this.nigun.context;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(this.gainNode);
        oscillator.frequency.value = fq;
        oscillator.type = this.oscillatorType;
        oscillator.start();

        oscillator._stop = ()=>{
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + this.oscillatorRelease);
            oscillator.stop(context.currentTime + this.oscillatorRelease);
        }
        
        return oscillator;
    }

    scheduleEvents(genericStartTime = this.context.currentTime) {

        this.currentChannelIndex = 0;
        this.eventsTimeline = [];

        this.timeline.forEach((item) => {

            let currentChannelIndex = this.currentChannelIndex;
            let channel = this.channels[currentChannelIndex];

            const startTime = genericStartTime + (item.time / 1000);
            const endTime = startTime + (item.length / 1000);

            channel.oscillator.frequency.setValueAtTime(item.note.fq, startTime);

            const attack = 0.001;
            const decay = 0.101;

            channel.gainNode.gain.setValueAtTime(0, startTime);
            channel.gainNode.gain.linearRampToValueAtTime(1, startTime + attack);
            channel.gainNode.gain.linearRampToValueAtTime(1, endTime - decay);
            channel.gainNode.gain.linearRampToValueAtTime(0, endTime);

            this.eventsTimeline.push({
                item,
                startTime: startTime,
                endTime: endTime,
            });

            this.currentChannelIndex++;
            if (this.currentChannelIndex == this.NUM_CHANNELS) this.currentChannelIndex = 0;

        });

    }

    unscheduleEvents(fromTime = this.context.currentTime){
        this.channels.forEach((channel)=>{
            channel.oscillator.frequency.cancelScheduledValues(fromTime);
            channel.gainNode.gain.cancelScheduledValues(fromTime);
        })
    }

    onplayended() {
        clearInterval(this.eventsInterval);
    }

    stop() {

        this.channels.forEach(channel => {
            channel.oscillator.stop();
        });

        this.channels = [];

        clearInterval(this.eventsInterval);

    }

    clear() {
        this.timeline = [];
    }

    add(ev) {
        this.timeline.push(ev);
    }

    setType(type = OSCILLATOR_TYPES.TRIANGLE) {
        this.DEFAULT_OSCILLATOR_TYPE = type;
        this.channels.forEach(c => {
            c.oscillator.type = type
        })
    }
}

class Sampler extends Instrument {

    constructor(nigun, settings = {}) {
        settings.type = INSTRUMENT_TYPES.SAMPLER;
        super(nigun, settings);
        this.init();
    }

    async init() {

        const settings = this.settings;

        if (settings.file) {
            fetch(settings.file)
                .then(response => response.arrayBuffer())
                .then(async arrayBuffer => {
                    this.arrayBuffer = arrayBuffer;
                    this.audioBuffer = await this.context.decodeAudioData(this.arrayBuffer);
                });
        }

        if (settings.notesMap) {
            const notesMap = settings.notesMap;
            this.notes = {};
            for (const note in notesMap) {
                fetch(notesMap[note])
                    .then(response => response.arrayBuffer())
                    .then(async arrayBuffer => {

                        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

                        this.notes[note] = {
                            arrayBuffer,
                            audioBuffer,
                            note: teoria.note.fromString(note),
                            start: (time = null, playbackRate = 1) => {
                                const source = this.nigun.context.createBufferSource();
                                source.buffer = audioBuffer;

                                source.playbackRate.value = playbackRate;

                                source.connect(this.gainNode);
                                source.start(time);

                                return source;
                            },
                            getSource: () => {
                                const source = this.nigun.context.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(this.gainNode);
                                return source;
                            }
                        };

                    });
            }
        }

    }

    startFrequency(fq) {
        const note = this.notes.C4;
        const source = this.context.createBufferSource();

        source.buffer = note.audioBuffer;
        source.connect(this.gainNode);
        source.playbackRate.value = fq / teoria.note.fromString('c4').fq();

        source.start();

        source._stop = ()=>{
            source.stop();
        }

        return source;
    }

    startPad(fq) {

        const note = this.notes.C4;

        const loopStart = this.settings.loopStart || 0.61;
        const loopEnd = this.settings.loopEnd || 1.6;
        const crossFadeDuration = this.settings.crossFadeDuration || 0.4;

        const source = this.context.createBufferSource();

        source.buffer = note.audioBuffer;
        source.loop = true;
        source.loopStart = loopStart;
        source.loopEnd = loopEnd;

        source.connect(this.gainNode);

        const crossFade = this.context.createGain();
        crossFade.gain.setValueAtTime(1, this.context.currentTime);
        crossFade.connect(this.gainNode);

        const crossFadeStart = loopEnd - crossFadeDuration;
        crossFade.gain.linearRampToValueAtTime(0, this.context.currentTime + crossFadeDuration);
        crossFade.gain.linearRampToValueAtTime(1, this.context.currentTime + crossFadeStart);

        source.playbackRate.value = fq / teoria.note.fromString('c4').fq();

        source.start();

        return source;

    }

    scheduleEvents(genericStartTime = this.context.currentTime) {

        this.eventsTimeline = [];
        this.playingNotes = [];

        this.timeline.forEach((item) => {

            const startTime = genericStartTime + (item.time / 1000);
            const endTime = startTime + (item.length / 1000);

            const source = this.notes.C4.getSource();
            source.playbackRate.value = item.note.fq / this.notes.C4.note.fq();
            source.start(startTime);
            // source.stop(endTime);

            this.playingNotes.push(source);

            this.eventsTimeline.push({
                item,
                startTime: startTime,
                endTime: endTime,
            });

        });

    }

    unscheduleEvents(fromTime = this.context.currentTime){
        this.playingNotes.forEach((source)=>{
            source.stop(fromTime);
        })
    }

    onplayended() {
        clearInterval(this.eventsInterval);
    }

    stop() {
        this.playingNotes.forEach((source) => { source.stop(); });
        clearInterval(this.eventsInterval);
    }

}

export default class Nigun {

    constructor(settings = {}) {

        const DEFAULTS = {
            loop: false,
            bpm: 120,
            gain: 0.75,
            instruments: [{
                    name: 'synth1',
                    type: INSTRUMENT_TYPES.SYNTH,
                    oscillator: CONSTANTS.OSCILLATOR_TYPES.TRIANGLE
                },
                {
                    name: 'metronome',
                    type: INSTRUMENT_TYPES.SAMPLER,
                    file: 'media/click.mp3',
                },
                {
                    name: 'piano',
                    type: INSTRUMENT_TYPES.SAMPLER,
                    notesMap: {
                        C4: 'media/Yamaha-TG77-Dulcimer-C4.wav',
                    },
                },
                {
                    name: 'windchime',
                    type: INSTRUMENT_TYPES.SAMPLER,
                    notesMap: {
                        C4: 'media/windchime_c4.mp3'
                    },
                },
                {
                    name: 'pad',
                    type: INSTRUMENT_TYPES.SAMPLER,
                    loopStart: 0.61,
                    loopEnd: 1.6,
                    crossFadeDuration: 0.4,
                    notesMap: {
                        C4: 'media/Korg-M3R-Ensemble-C4.wav'
                    },
                },
            ],
        };

        this.settings = Object.assign(DEFAULTS, settings);

        this.bpm = this.settings.bpm;
        this.loop = this.settings.loop;

        this.instruments = [];

        this.time = 0;

        this.timeline = [];
        this.timelinePointer = 0;

        this.IS_PLAYING = false;
        this.INITED = false;

        this.CONSTANTS = CONSTANTS;

        this.MAX_GAIN = 0.5;
        this.NUM_CHANNELS = 16;
        this.DEFAULT_OSCILLATOR_TYPE = CONSTANTS.OSCILLATOR_TYPES.TRIANGLE;

        this.bars = 4;

        this.init();

        this.createInstruments(this.settings.instruments);

        this.metronome = true;
        this.Metronome = new Metronome(this);

    }

    getMsPerBeat(bpm = this.bpm) {
        return 1000 * 60 / bpm;
    }

    getNoteLengthsByBpm(bpm = this.bpm) {
        let ms = this.getMsPerBeat();
        let o = {};
        for (var x in CONSTANTS.NOTE_LENGTHS) o[x] = ms * CONSTANTS.NOTE_LENGTHS[x]
        return o;
    }

    async init(oninit) {

        this.context = new AudioContext;

        this.context.onstatechange = () => {
            if (oninit) oninit();
        }

        this.createGains();

        this.mainInstrument = this._synth1;

        this.INITED = true;

    }

    createGains() {

        this.masterGain = this.context.createGain();
        this.masterGain.gain.value = this.settings.gain;
        this.masterGain.connect(this.context.destination);

        this.compressor = this.context.createGain();
        this.compressor.connect(this.masterGain);

    }

    async createInstruments(instrumentsData) {
        for (var x in instrumentsData) await this.createInstrument(instrumentsData[x]);
    }

    async createInstrument(settings) {
        let instrument;
        switch (settings.type) {
            case INSTRUMENT_TYPES.SAMPLER:
                instrument = new Sampler(this, settings);
                break;
            case INSTRUMENT_TYPES.SYNTH:
                instrument = new Synth(this, settings);
        }
        this.instruments.push(instrument);
        this.instruments.forEach((instrument) => {
            this['_' + instrument.name] = instrument;
        })
    }

    stop() {

        const instruments = this.playingInstruments || [];

        instruments.forEach((instrument) => {
            instrument.stop();
        })

        clearInterval(this.endTimeout);

        this.Metronome.stop();

        this.IS_PLAYING = false;

        if (this.onstop) this.onstop();

    }

    async play(settings = {}) {

        this.IS_PLAYING = true;

        if (this.context.state === "suspended") {
            await this.context.resume();
        }

        settings.genericStartTime = this.context.currentTime;

        this.playingInstruments = [];

        if (settings.instruments) settings.instruments.forEach((ins) => {
            const instrument = this['_' + ins.name];
            for (const x in ins) instrument[x] = ins[x];
            if (instrument.type === INSTRUMENT_TYPES.SYNTH) instrument.createChannels();
            this.playingInstruments.push(instrument);
        });

        if (settings.bars) this.bars = settings.bars;
        if (settings.bpm) this.bpm = settings.bpm;

        if (this.endTimeout) clearTimeout(this.endTimeout);

        this.playTimeline(settings);


    }

    async playTimeline(settings) {

        this.Metronome.stop();
        if (settings.metronome) this.Metronome.create();

        this.playingInstruments.forEach((instrument) => {

            instrument.scheduleEvents(settings.genericStartTime);

            const eventsTimeline = [...instrument.eventsTimeline];

            instrument.eventsInterval = setInterval(() => {
                const now = this.context.currentTime;
                const item = eventsTimeline[0];
                if (now > item.startTime && !item.started) {
                    item.started = true;
                    if (instrument.oneventstart) instrument.oneventstart(item)
                } else if (now > item.endTime && !item.ended) {
                    item.ended = true;
                    if (instrument.oneventend) instrument.oneventend(item);
                    eventsTimeline.shift();
                    if (!eventsTimeline.length) clearInterval(instrument.eventsInterval);
                }
            }, 10);

        })

        const endTime = this.getTimelineDuration();

        this.endTimeout = setTimeout(() => {

            this.playingInstruments.forEach((instrument) => {
                instrument.onplayended();
            })

            this.onplayended(settings);

        }, endTime);

    }

    onplayended(settings) {
        if (settings.goFaster) this.setBpm(this.bpm + settings.goFaster);
        if (settings.onended) settings.onended();
        if (settings.loop) this.play(settings);
        else this.stop();
    }

    setBpm(newBpm) {

        let ratio = this.bpm / newBpm;
        this.bpm = newBpm;

        this.timeline.forEach(note => {
            note.time = note.time * ratio;
            note.length = note.length * ratio;
        });

    }

    transpose(frequencyMultiplier) {

        this.timeline.forEach(note => {
            if (note.freq) note.freq = note.freq * frequencyMultiplier;
        });

    }

    transposeByTET(steps = 1, TET = 12) {
        this.transpose(this.getFrequency(1, TET, steps));
    }

    getTimelineDuration() {
        let t = 0;
        if (!this.playingInstruments || !this.playingInstruments.length) return 0;
        this.playingInstruments.forEach((instrument) => {
            const last = instrument.timeline[instrument.timeline.length - 1];
            const instrumentTime = (last.time + last.length);
            if (instrumentTime > t) t = instrumentTime;
        })
        return t;
    }

    getFrequency(rootFrequency, TET = 12, stepsFromBase) {
        return rootFrequency * Math.pow(Math.pow(2, 1 / TET), stepsFromBase);
    }

    calculate24TETSteps(frequency1, frequency2) {
        const TET = 24; // Equal temperament
        const rootFrequency = frequency1;
        const frequencyRatio = frequency2 / rootFrequency;

        const stepsFromBase = Math.round(TET * Math.log(frequencyRatio) / Math.log(2));

        return stepsFromBase;
    }

    /**
     * 
     * @param {*} settings
     * @param {*} settings.TET
     * settings = {
     *  TET: 12,
     *  rootFrequency: 261.63, (c4 when a4=440)
     *  steps: [ 1,1,0.5,1,1,1,0.5 ] // major
     * }
     */

    getScale(settings = {}) {

        let scale = [];

        let {
            TET = 24,
                root, // ex. c4
                rootFrequency = 261.63,
                steps = CONSTANTS.SCALES.MAJOR.steps,
                stepsMultiplier = 4,
                octaves = 6,
                concertPitch = 440,
                detune = 0, // frequency
                shift = CONSTANTS.MODE_SHIFTS.IONIAN, // shift to different mode
                accidental = null, // CONSTANTS.ACCIDENTALS.FLAT,
                align = true,
                dropNotes = null, // [4,7] - major pentatonic, [2,6] - minor pentatonic
        } = settings;

        if (root) rootFrequency = teoria.note(root).fq(concertPitch);

        if (!accidental) {
            accidental = root.indexOf('#') !== -1 ? CONSTANTS.ACCIDENTALS.SHARP : CONSTANTS.ACCIDENTALS.FLAT;
        }

        rootFrequency += detune + (440 - concertPitch);

        steps = steps.map((step) => {
            return step *= stepsMultiplier
        });

        if (shift) {
            function rotateLeft(arr) {
                let first = arr.shift();
                arr.push(first);
                return arr;
            }
            for (let x = 0; x < shift; x++) steps = rotateLeft(steps);
        }

        const originalSteps = [...steps];

        for (let x = 0; x < octaves - 1; x++) {
            steps = steps.concat(originalSteps);
        }

        let stepsTotal = [0];

        steps.reduce((a, c) => {
            stepsTotal.push(a + c);
            return a + c
        }, 0);

        let totalLength = steps.length;

        let stepsIndex = 0;

        const accidentalTransformInto = {
            [CONSTANTS.ACCIDENTALS.FLAT]: {
                'c#': 'db',
                'd#': 'eb',
                'f#': 'gb',
                'g#': 'ab',
                'a#': 'bb',
            },
            [CONSTANTS.ACCIDENTALS.SHARP]: {
                'db': 'c#',
                'eb': 'd#',
                'gb': 'f#',
                'ab': 'g#',
                'bb': 'a#',
            },
        };

        const uniformNames = {
            'c#': 'db',
            'd#': 'eb',
            'f#': 'gb',
            'g#': 'ab',
            'a#': 'bb',
            'cb': 'b',
            'fb': 'e',
            'b#': 'c',
            'e#': 'f',
        };

        let notes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        notes = [...notes, ...notes, ...notes];

        let alignedNotes = null;

        window._scaleDebug = [];

        for (let x = 0; x <= totalLength; x++) {

            const scaleDegree = (x % originalSteps.length) + 1;

            let fq = this.getFrequency(rootFrequency, TET, stepsTotal[x]);

            // console.log(this.calculate24TETSteps(rootFrequency, fq));

            const note = teoria.note.fromFrequency(fq, concertPitch);
            const cents = note.cents;

            let octave = note.note.octave();
            let shortname = note.note.toString(true);

            if (accidentalTransformInto[accidental][shortname]) {
                shortname = accidentalTransformInto[accidental][shortname];
            }

            let _accidental = shortname.slice(1);

            let name = `${shortname[0]}`;

            let quarterSymbol = '';

            if (cents <= -40) quarterSymbol = '𝄳';
            if (cents >= 40) quarterSymbol = '𝄲';

            _accidental += quarterSymbol;

            let uniformName = shortname;

            if (uniformNames[shortname]) uniformName = uniformNames[shortname];

            window._scaleDebug.push(note);

            if (align) {

                const shiftArray = (arr, n) => {
                    return arr.slice(n).concat(arr.slice(0, n));
                }

                if (!alignedNotes && !x) {
                    alignedNotes = shiftArray(notes, notes.indexOf(shortname[0]));
                }

                if (alignedNotes && alignedNotes[scaleDegree - 1] !== shortname[0]) {

                    const targetNote = alignedNotes[scaleDegree - 1];
                    const current = shortname[0];

                    if (targetNote === 'c' && current === 'b') octave++;

                    if (targetNote === 'b' && current === 'c') octave--;
                    if (targetNote === 'b' && current === 'd') octave--;
                    if (targetNote === 'a' && current === 'c') octave--;

                    name = targetNote;

                    const target = teoria.note.fromString(targetNote + (octave));

                    const qtones = this.calculate24TETSteps(target.fq(), fq);

                    const r = qtones / 2;

                    let half = 0;
                    let accidentals = 0;

                    if (r % 1 === 0.5) {
                        half = 1;
                        accidentals = r - 0.5;
                    } else if (r % 1 === 0) {
                        accidentals = r;
                    }

                    const accidental = accidentals >= 0 ? '#' : 'b';
                    const halfAccidental = accidentals >= 0 ? '𝄲' : '𝄳';

                    let accidentalString = '';
                    for (let acc = 0; acc < Math.abs(accidentals); acc++) accidentalString += accidental;

                    if (half) accidentalString += halfAccidental;

                    shortname = targetNote + accidentalString;

                    _accidental = accidentalString;

                }

            }

            _accidental = _accidental.replaceAll('##', CONSTANTS.ACCIDENTALS_CHARACTERS.DOUBLE_SHARP);
            _accidental = _accidental.replaceAll('bb', CONSTANTS.ACCIDENTALS_CHARACTERS.DOUBLE_FLAT);
            _accidental = _accidental.replaceAll('#', CONSTANTS.ACCIDENTALS_CHARACTERS.SHARP);
            _accidental = _accidental.replaceAll('b', CONSTANTS.ACCIDENTALS_CHARACTERS.FLAT);
            _accidental = _accidental.replaceAll('♯𝄳', CONSTANTS.ACCIDENTALS_CHARACTERS.HALF_SHARP);

            if (_accidental == '♯𝄲') {
                shortname = `${uniformName}${quarterSymbol}`;
                _accidental = quarterSymbol;
                name = uniformName;
            }

            scale[x] = {
                fq,
                note,
                name,
                cents,
                quarterSymbol,
                accidental: _accidental,
                shortname,
                octave,
                uniformFullname: `${uniformName}${note.note.octave()}${quarterSymbol}`,
                scaleDegree,
                uniformName,
            };

            stepsIndex += 1;

            if (x == totalLength) stepsIndex = 0;

        }

        if (dropNotes) {
            scale = scale.filter(n => {
                return dropNotes.indexOf(n.scaleDegree) === -1;
            })
        }

        return scale;

    }

    sequencer(settings = {}) {

        const timeline = [];

        let {
            scale = this.getScale(),
                pattern = CONSTANTS.SEQUENCER_PATTERNS.UP,
                bpm = this.bpm,
                mirror = false, // extend reverse
                extend = 0, // extend to higher octaves
                extendSteps = 7, // extend by steps
                extendMirror = false, // mirror extended result
                dropLast = false, // cleaner loop purposes
                playRoot = false, // play root across entire duration
                startTime = 0,
                reps = 1,
        } = settings;

        let time = startTime;
        let msPerBeat = this.getMsPerBeat(bpm);

        if (mirror) {
            let mirror = [...pattern];
            pattern = pattern.concat(mirror.reverse());
        }

        const extendItem = (item, amountSteps) => {
            let step = item;
            return step + amountSteps;
        }

        if (extend) {
            let extensions = [];
            for (let x = 0; x < extend; x++) {
                const extension = [];
                const source = extensions.length ? extensions[extensions.length - 1] : pattern;
                source.forEach((item) => {
                    extension.push(extendItem(item, extendSteps))
                })
                extensions.push(extension);
            }
            extensions.forEach((extension) => {
                pattern = pattern.concat(extension);
            })
        }

        if (extendMirror) {
            let extendMirror = [...pattern];
            pattern = pattern.concat(extendMirror.reverse());
        }

        const stringToObj = (str) => {
            const num = parseInt(str);
            const letter = /[a-zA-Z]/.test(str) ? str.charAt(str.length - 1) : null;
            const obj = {
                position: num
            };
            obj.length = letter ? CONSTANTS.LETTERS_TO_LENGTH[letter] : CONSTANTS.NOTE_LENGTHS.WHOLE;
            return obj;
        }

        const parseObject = (o) => {

            switch (typeof o) {
                case 'number':
                    o = {
                        position: o,
                        length: CONSTANTS.NOTE_LENGTHS.WHOLE
                    }
                    break;
                case 'string':
                    o = stringToObj(o);
                    break;
            }

            return o;

        }

        pattern.forEach((item) => {

            let o = JSON.parse(JSON.stringify(item));

            if (Array.isArray(o)) {

                let longestLength = 0;

                o.map(oo => {

                    oo = parseObject(oo);

                    const length = msPerBeat * oo.length;
                    if (length >= longestLength) longestLength = length;

                    timeline.push({
                        time,
                        length,
                        note: scale[oo.position - 1],
                        gain: (this.MAX_GAIN / (o.length)),
                        endTime: time + length,
                    })

                })

                time += longestLength;

            } else {

                o = parseObject(o);

                const length = msPerBeat * o.length;

                timeline.push({
                    time,
                    length,
                    note: scale[o.position - 1],
                    endTime: time + length,
                })

                time += length;

            }

        });

        if (dropLast) timeline.pop();

        if (playRoot) {
            const rootLength = this.getTimelineDuration(timeline);
            timeline.push({
                time: 0,
                length: rootLength,
                note: scale[0],
                gain: 0.1,
                endTime: rootLength,
            })
        }

        if (reps > 1) {

            const timelines = [timeline];
            const settingsClone = {
                ...settings
            };

            settingsClone.reps = 1;

            for (let x = 0; x < reps - 1; x++) {

                const lastTimeline = timelines[timelines.length - 1];

                settingsClone.startTime = lastTimeline[lastTimeline.length - 1].endTime;

                timelines.push(
                    this.sequencer(settingsClone)
                )

            }

            const finalTimeline = timelines.reduce((acc, curr) => acc.concat(curr), []);

            return finalTimeline;

        }

        return timeline;

    }

}