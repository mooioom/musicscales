import * as CONSTANTS from './constants.js';
import './teoria.js';

const getFrequency = (rootFrequency, TET = 12, stepsFromBase)=>{
    return rootFrequency * Math.pow(Math.pow(2, 1 / TET), stepsFromBase);
}

const INSTRUMENT_TYPES = {
    SAMPLER: 'SAMPLER',
    SYNTH: 'SYNTH',
}

class Instrument {
    constructor(base, settings = {}) {

        this.base = base;
        this.context = base.context;
        this.settings = settings;

        this.name = settings.name;

        this.gainNode = this.context.createGain();
        this.gainNode.gain.value = settings.gain || 1;
        this.gainNode.connect(base.masterGain);

        this.type = settings.type || INSTRUMENT_TYPES.SYNTH;

    }

}

class Synth extends Instrument {
    constructor(base, settings = {}) {

        settings.type = INSTRUMENT_TYPES.SYNTH;

        super(base, settings);

        this.DEFAULT_OSCILLATOR_TYPE = CONSTANTS.OSCILLATOR_TYPES.TRIANGLE;
        this.oscillatorType = settings.oscillatorType || this.DEFAULT_OSCILLATOR_TYPE;
        this.oscillatorRelease = settings.oscillatorRelease || 0.1;

        this.playingNotes = [];

    }

    startFrequency(fq) {
        if (!fq) return;
        const context = this.base.context;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(this.gainNode);
        oscillator.frequency.value = fq;
        oscillator.type = this.oscillatorType;
        oscillator.start();

        oscillator._stop = () => {
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + this.oscillatorRelease);
            oscillator.stop(context.currentTime + this.oscillatorRelease);
        }

        return oscillator;
    }

    schedule(timeline, contextStartTime, diff = 0, stopTime, gainNode = null) {

        this.stop(stopTime);

        const eventsTimeline = [];

        timeline.forEach((item) => {

            const startTime = contextStartTime + this.base.utils.toRealTime(item.startTime) - diff;
            const endTime = startTime + this.base.utils.toRealTime(item.length || 1);

            const oscillator = this.context.createOscillator();
            const gain = this.context.createGain();

            oscillator.connect(gain);

            if(gainNode){
                gain.connect(gainNode);
                gainNode.connect(this.gainNode);
            }else{
                gain.connect(this.gainNode);
            }

            oscillator.type = this.oscillatorType;
            oscillator.frequency.value = 0;

            oscillator.start();

            oscillator.frequency.setValueAtTime(item.fq, startTime);

            const attack = 0.001;
            const decay = 0.101;

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(1, startTime + attack);
            gain.gain.linearRampToValueAtTime(1, endTime - decay);
            gain.gain.linearRampToValueAtTime(0, endTime);

            this.playingNotes.push({
                startTime,
                endTime,
                gain,
                oscillator,
            });

            eventsTimeline.push({
                item,
                startTime,
                endTime,
            });

        });

        return eventsTimeline;

    }

    stop(fromTime = this.context.currentTime) {

        this.playingNotes.forEach((item) => {
            if(item.startTime <= fromTime && item.endTime >= fromTime) return item.oscillator.stop(item.endTime);
            item.oscillator.stop(fromTime);
        });

        this.playingNotes = [];

    }
}

class Sampler extends Instrument {

    constructor(base, settings = {}) {
        settings.type = INSTRUMENT_TYPES.SAMPLER;
        super(base, settings);
        this.playingNotes = [];
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
                                const source = this.base.context.createBufferSource();
                                source.buffer = audioBuffer;

                                source.playbackRate.value = playbackRate;

                                source.connect(this.gainNode);
                                source.start(time);

                                return source;
                            },
                            getSource: (gainNode) => {
                                const source = this.base.context.createBufferSource();
                                source.buffer = audioBuffer;
                                if(gainNode){
                                    source.connect(gainNode);
                                    gainNode.connect(this.gainNode);
                                }else source.connect(this.gainNode);
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

        source._stop = () => {
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

    schedule(timeline, contextStartTime, diff = 0, stopTime, gainNode = null) {

        // console.log('intrument schedule', timeline);

        this.stop(stopTime);
        const eventsTimeline = [];

        timeline.forEach((item) => {

            const startTime = contextStartTime + this.base.utils.toRealTime(item.startTime) - diff; // real time
            const endTime = startTime + this.base.utils.toRealTime(item.length || 1); // real time

            // console.log(contextStartTime, startTime, diff, item.fq);

            const source = this.notes.C4.getSource(gainNode);
            source.playbackRate.value = item.fq / this.notes.C4.note.fq();
            source.start(startTime);
            source.stop(endTime);

            this.playingNotes.push({
                startTime,
                endTime,
                source,
            });

            eventsTimeline.push({
                item,
                startTime,
                endTime,
            });

        });

        return eventsTimeline;

    }

    stop(fromTime = this.context.currentTime) {

        this.playingNotes.forEach((item) => {
            if(item.startTime <= fromTime && item.endTime >= fromTime) return item.source.stop(item.endTime);
            item.source.stop(fromTime);
        });

        this.playingNotes = [];

    }

}

class Track {
    constructor(settings = {}) {

        this.base = settings.base;
        this.context = this.base.context;

        this.gainNode = this.context.createGain();

        this.instrument = settings.instrument;

        this.name = settings.name;

        this.base.tracks[this.name] = this;

        this.isMuted = settings.isMuted;
        this.isSolo = settings.isSolo;

        this.oneventstart = settings.oneventstart ? settings.oneventstart : () => {};
        this.oneventend = settings.oneventend ? settings.oneventend : () => {};

        this.sequences = settings.sequences || [];

        this.events = [];

    }

    /**
     * @function schedule
     * @param {*} startTime        // normal time
     * @param {*} contextStartTime // reschedule time (real time)
     */
    schedule(startTime, contextStartTime, stopTime) {
        const timeline = [];
        this.sequences.forEach(sequence=>{
            sequence.timeline.forEach(item=>{
                if(startTime <= (item.startTime + sequence.startTime)) timeline.push({
                    startTime: sequence.startTime + item.startTime,
                    length: item.length,
                    fq: item.fq,
                    item,
                });
            })
        })
        this.events = this.instrument.schedule(
            timeline, 
            contextStartTime, 
            this.base.utils.toRealTime(startTime), 
            stopTime, 
            this.gainNode
        );
    }

    processEvents() {

        const now = this.context.currentTime;
        const item = this.events[0];

        if(!item) return;

        if (now > item.startTime && !item.started) {
            item.started = true;
            if (this.oneventstart) this.oneventstart(item)
        } else if (now > item.endTime && !item.ended) {
            item.ended = true;
            if (this.oneventend) this.oneventend(item);
            this.events.shift();
        }

    }

    getLengthTime(){
        let longestTime = 0;
        this.sequences.forEach((s)=>{
            s.timeline.forEach(item=>{
                const finalTime = s.startTime + item.startTime + item.length;
                if(finalTime >= longestTime) longestTime = finalTime;
            })
        })
        return this.base.utils.toRealTime(longestTime)
    }

    getLengthMeasures(){
        return this.base.utils.getMeasuresCount(this.getLengthTime());
    }

}

class Sequence {
    constructor(settings = {}) {
        this.startTime = settings.startTime || 0;
        this.loop = settings.loop;
        this.base = settings.base;
        this.timeline = settings.timeline ? settings.timeline : [];
    }
    shiftTime( appendTime = 0 ){
        this.startTime += appendTime;
    }
}

class Utils {

    constructor(base) {
        this.base = base;
    }

    calculateNewEventTime(newBpm) {
        const ratio = this.bpm / newBpm;
        const now = this.context.currentTime;
        this.timeline.forEach(item => {
            item.startTime = now + (item.startTime - now) * ratio;
            item.startEnd = now + (item.startEnd - now) * ratio;
        })
    }

    secondsPerBeat(bpm = this.base.settings.bpm) {
        return 60 / bpm;
    }

    getSignature() {
        return this.base.settings.signature.split('/').map(a => {
            return Number(a)
        });
    }

    getMeasureTime( num = 1 ){
        return this.getSignature()[0] * (60 / this.base.settings.bpm) * num;
    }

    getMeasuresCount( time = (this.base.time.end - this.base.time.start) ){
        return time / this.getMeasureTime();
    }

    toRealTime(normalTime = 0) {
        return normalTime * (60 / this.base.settings.bpm);
    }

    toNormalTime(realTime = 0){
        return (realTime * this.base.settings.bpm) / 60
    }

    getNoteLength(note = 0.25){ // ex. 0.25 - quarter note
        return (1 / note * note) * (this.base.settings.bpm / 60)
    }

    getSequenceLengthTime(sequence){
        if(!sequence.timeline.length) return 0;
        const last = sequence.timeline[sequence.timeline.length - 1];
        return this.toRealTime(last.startTime + last.length);
    }

    getSequenceLengthMeasures(sequence){
        return this.getSequenceLengthTime(sequence) / this.getMeasureTime()
    }

    getTimelineLength(timeline = []){
        const last = timeline[timeline.length - 1];
        if(!last) return 0;
        return last.startTime + last.length;
    }

    calculate24TETSteps(frequency1, frequency2) {
        const TET = 24; // Equal temperament
        const rootFrequency = frequency1;
        const frequencyRatio = frequency2 / rootFrequency;

        const stepsFromBase = Math.round(TET * Math.log(frequencyRatio) / Math.log(2));

        return stepsFromBase;
    }

}

/**
 * there are two types of times
 * 1. normal time - 60bpm - this is used in all sequences and timelines reason to keep them by reference (normalized)
 * 2. real time - calculated from normal time according settings.bpm
 */

class Nigun {
    constructor(settings = {}) {

        const DEFAULTS = {
            bpm: 120,
            gain: 0.3,
            signature: '4/4',
            onmetronomebeat: ()=>{},
            onrender: ()=>{},
            ontimeset: ()=>{},
            onstop: ()=>{},
            instruments: [{
                    name: 'synth1',
                    type: INSTRUMENT_TYPES.SYNTH,
                    oscillator: CONSTANTS.OSCILLATOR_TYPES.TRIANGLE
                },
                {
                    name: 'metronome',
                    type: INSTRUMENT_TYPES.SAMPLER,
                    notesMap: {
                        C4: 'media/click.mp3',
                    },
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
        this.utils = new Utils(this);

        this.tracks = {};
        this.sequences = [];
        this.instruments = {};

        this.time = { // real time
            start: 0,
            end: this.utils.getMeasureTime(1),
            current: 0,
        };

        this.eventsInterval = null;
        this.CONSTANTS = CONSTANTS;

        this.init();

    }

    async init() {

        this.context = await new AudioContext;

        this.createMixer();
        await this.createInstruments(this.settings.instruments);
        this.createMetronome();

        if(this.settings.oninit) this.settings.oninit();

    }

    createMixer() {

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
        this.instruments[instrument.name] = instrument;
        return instrument;
    }

    createTrack(data={}) {
        data.base = this;
        return new Track(data);
    }

    createSequence(data){
        data.base = this;
        return new Sequence(data);
    }

    createMetronome() {
        this.createTrack({
            name: 'metronome',
            instrument: this.instruments.metronome,
            oneventstart: (ev)=>{
                // console.log(1, ev);
                if(this.settings.onmetronomebeat) this.settings.onmetronomebeat();
            }
        });
    }

    resetMetronome() {
        const beats = this.utils.getSignature()[0] * Math.ceil(this.utils.getMeasuresCount());

        const timeline = [];

        for (let x = 0; x < beats; x++) {
            timeline.push({
                startTime: x,
                fq: !(x % this.utils.getSignature()[0]) ? 440 : 330,
            })
        }

        const sequence = new Sequence({
            startTime: 0,
            timeline,
        });

        this.tracks.metronome.sequences = [sequence];

    }

    toggleMetronome(set){
        this.toggleTrack('metronome', set);
    }

    toggleTrack(name, set){
        if(!this.tracks[name]) return;
        if(typeof set !== 'undefined'){
            this.tracks[name].gainNode.gain.value = set ? 1 : 0;
            return;    
        }
        const gain = this.tracks[name].gainNode.gain.value;
        this.tracks[name].gainNode.gain.value = gain ? 0 : 1;
    }

    getTracks() {
        return Object.keys(this.tracks).map(t => {
            return this.tracks[t];
        })
    }

    getPlayingTracks() {
        const tracks = this.getTracks();
        const soloed = tracks.filter(t => {
            return t.isSolo
        });
        if (soloed.length) return [this.tracks.metronome].concat(soloed);
        else {
            return tracks.filter(t => {
                return !t.isMuted
            })
        }
    }

    render() {
        if(this.settings.onrender) this.settings.onrender();
    }

    play() {

        this.IS_PLAYING = true;

        this.resetMetronome();

        this.playStartTime = this.time.current;
        this.playContextStartTime = this.context.currentTime;
        this.originalPlayContextStartTime = this.context.currentTime;
        this.playRepeat = 1;
        this.shouldReschedule = true;

        const rescehduleDiff = this.time.current;

        const tracks = this.getPlayingTracks();

        clearInterval(this.eventsInterval);

        this.eventsInterval = setInterval(() => {

            const elpasedTime = this.context.currentTime - this.playContextStartTime; // elpased time in seconds 

            this.time.current = this.playStartTime + elpasedTime;
            this.render();

            if (this.time.current >= this.time.end - 0.1 && this.shouldReschedule) {

                this.shouldReschedule = false;

                const rescheduleTime = (this.originalPlayContextStartTime + (this.time.end * this.playRepeat)) - rescehduleDiff;

                // console.log('rescehdule', rescheduleTime);

                tracks.forEach((track) => {
                    track.schedule(this.utils.toNormalTime(this.time.start), rescheduleTime, rescheduleTime);
                });

            }

            if (this.time.current >= this.time.end - 0.01) {

                this.shouldReschedule = true;

                this.playStartTime = this.time.start;
                this.playContextStartTime = this.context.currentTime;
                this.playRepeat++;

            }

            tracks.forEach((track) => {
                track.processEvents();
            });

        }, 2);

        // console.log('scehdule', this.playContextStartTime);

        tracks.forEach((track) => {
            track.schedule(this.utils.toNormalTime(this.playStartTime), this.playContextStartTime);
        });

    }

    stop() {
        this.IS_PLAYING = false;
        this.time.current = this.time.start;
        this.render();
        this.stopAudio();
        this.settings.onstop();
    }

    stopAudio(){
        this.getTracks().forEach(t => t.instrument.stop());
        clearInterval(this.eventsInterval);
    }

    pause() {
        this.IS_PLAYING = false;
        this.stopAudio();
    }

    setTempo(newBpm) {
        if(!newBpm || newBpm >= 1000) return;
        this.time.current = this.time.current * (this.settings.bpm / newBpm);
        this.time.start = this.time.start * (this.settings.bpm / newBpm);
        this.time.end = this.time.end * (this.settings.bpm / newBpm);
        this.settings.bpm = newBpm;
        this.render();
        if(this.IS_PLAYING) this.play();
    }

    setCurrentTime(time){
        this.time.current = time;
        this.render();
        if(this.IS_PLAYING) this.play();
    }

    setLengthByTrack(track){
        this.time.start = 0;
        this.time.end = track.getLengthTime();
        this.settings.ontimeset();
    }

    reschedule(){
        if(this.IS_PLAYING) this.play();
    }

    getScale(settings = {}){

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
            accidental = root ? 
                root.indexOf('#') !== -1 ? CONSTANTS.ACCIDENTALS.SHARP : CONSTANTS.ACCIDENTALS.FLAT : 
                CONSTANTS.ACCIDENTALS.FLAT;
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

        const capitalizeFirstLetter = str => str.replace(/^\w/, c => c.toUpperCase());
    
        for (let x = 0; x <= totalLength; x++) {
    
            const scaleDegree = (x % originalSteps.length) + 1;
    
            let fq = getFrequency(rootFrequency, TET, stepsTotal[x]);
    
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
    
                    const qtones = this.utils.calculate24TETSteps(target.fq(), fq);
    
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
                uniformNameCapitalized: capitalizeFirstLetter(uniformName),
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
                defaultNoteLength = CONSTANTS.NOTE_LENGTHS.QUARTER,
                mirror = false, // extend reverse
                extend = 0, // extend to higher octaves
                extendSteps = 7, // extend by steps
                extendMirror = false, // mirror extended result
                dropLast = false, // cleaner loop purposes
                playRoot = false, // play root across entire duration
                startTime = 0,
                reps = 1,
        } = settings;

        let secondsPerBeat = this.utils.secondsPerBeat(bpm);

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
                        length: this.utils.getNoteLength(defaultNoteLength),
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

                    const length = secondsPerBeat * oo.length;
                    if (length >= longestLength) longestLength = length;

                    const note = scale[oo.position - 1];

                    timeline.push({
                        startTime,
                        length,
                        fq: note.fq,
                        note,
                        gain: (this.MAX_GAIN / (o.length)),
                        endTime: startTime + length,
                    })

                })

                startTime += longestLength;

            } else {

                o = parseObject(o);

                const length = secondsPerBeat * o.length;
                const note = scale[o.position - 1];

                timeline.push({
                    startTime,
                    length,
                    fq: note.fq,
                    note,
                    endTime: startTime + length,
                })

                startTime += length;

            }

        });

        if (dropLast) timeline.pop();

        if (playRoot) {
            const rootLength = this.getTimelineDuration(timeline);
            const note = scale[0];
            timeline.push({
                startTime: 0,
                length: rootLength,
                fq: note.fq,
                note,
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

export default Nigun;