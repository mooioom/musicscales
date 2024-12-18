import * as CONSTANTS from './constants.js';

let padSource = null;

window.functions = {

    capitalize: (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    },

    isMobile: () => {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    },

    toggleMetronome: () => {
        app.settings.metronome = !app.settings.metronome;
        cache.set('metronome', app.settings.metronome);
        nigun.toggleMetronome(app.settings.metronome);
        app.render();
    },

    togglePad: () => {

        const keyToNote = {
            'C': 'c',
            'C#': 'c#',
            'Db': 'c#',
            'D': 'd',
            'D#': 'd#',
            'Eb': 'd#',
            'E': 'e',
            'F': 'f',
            'F#': 'f#',
            'Gb': 'f#',
            'G': 'g',
            'G#': 'g#',
            'Ab': 'g#',
            'A': 'a',
            'A#': 'a#',
            'Bb': 'a#',
            'B': 'b',
        }

        const note = keyToNote[app.settings.key];

        const octave = 2; // Object.keys(keyToNote).indexOf(app.settings.key) > 5 ? 2 : 3;

        if (app.padIsPlaying && padSource) {
            app.padIsPlaying = false;
            padSource.stop();
        } else {
            app.padIsPlaying = true;
            padSource = nigun.instruments.pad.startPad(teoria.note.fromString(note + octave).fq());
        }

        app.render();
    },

    parseKey: (key) => {

        if (key.indexOf('/') === -1) return key;

        const s = key.split('/');
        const sharp = s[0];
        const flat = s[1];

        return app.settings.accidental === CONSTANTS.ACCIDENTALS.SHARP ? sharp : flat;

    },

    fetchArray: async (urls) => {
        const responses = [];
        for (const url of urls) {
            const response = await fetch(url);
            const data = await response.text();
            responses.push(data);
        }
        return responses;
    },

    fullscreen: () => {

        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        }

        const elem = document.body;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Safari */
            elem.webkitRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            /* IE11 */
            elem.msRequestFullscreen();
        }

    },

    forEachNotesElements: (noteFullname, fn) => {
        [].slice.call(document.querySelectorAll('[note="' + noteFullname + '"]')).forEach(fn)
    },

    unlightAllNotes: () => {
        Array.from(document.querySelectorAll('.playing')).forEach(($el) => {
            $el.classList.remove('playing');
        });
    },

    lightNotes: (uniformFullname) => {
        Array.from(document.querySelectorAll('[note="' + uniformFullname + '"]')).forEach(($el) => {
            $el.classList.add('playing');
        });
    },

    noteDisplayName: (note) => {
        return `${note.name.toUpperCase()}<span class="accidental">${note.accidental}</span>`;
    },

    integerToRoman: (num) => {
        if (typeof num !== 'number') return false;
        var values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        var numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
        var result = '';
        for (var i = 0; i < values.length; i++) {
            while (num >= values[i]) {
                result += numerals[i];
                num -= values[i];
            }
        }
        return result;
    },

    debounce: function (fn, ms = 200) {

        if (this.debouceTimeout) {
            this.debouceFinal = fn;
            return;
        }

        this.debouceTimeout = setTimeout(() => {
            this.debouceFinal ? this.debouceFinal() : fn();
            delete this.debouceTimeout;
            delete this.debouceFinal;
        }, ms)

    },

    createChords: () => {

        const scalesNotes = [];

        const capitalize = (str)=>{
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        app.ALL_KEYS.forEach((key)=>{
            Object.keys(CONSTANTS.SCALES).forEach((scaleName)=>{
                const scale = app.getScale(app.settings.octave, key, scaleName, true);  
                scalesNotes.push({
                    name: `${key}_${scaleName}`,
                    notes: scale.map(n=>{
                        return capitalize(n.note.note.toString(true))
                    })
                });
            })
        })

        console.log(scalesNotes);

        const chords = [];

        let l = 0;

        app.ALL_KEYS.forEach((key) => {

            // console.log(key);

            const scale = app.getScale(app.settings.octave, key, 'MAJOR');

            CONSTANTS.CHORDS.forEach((chordData) => {

                if (chordData.name === 'maj') chordData.name = '';

                const chordName = `${key}${chordData.name}`;
                const aka = chordData.aka.map((n) => `${key}${n}`)
                const notes = [];

                const intervals = chordData.intervals;

                intervals.forEach((interval) => {

                    const num = Number(interval.match(/\d+/g)[0]);
                    let flats = interval.match(/b+/g);
                    let sharps = interval.match(/#+/g);

                    if (flats) flats = flats.join();
                    if (sharps) sharps = sharps.join();

                    const note = scale[num - 1];

                    const noteName = note.name.toUpperCase();
                    const accidentals = note.accidental.replaceAll('♭', 'b').replaceAll('♯', '#').replaceAll('𝄪', '##');

                    let allAccidentals = (accidentals || '') + (flats || '') + (sharps || '');

                    const numFlats = (allAccidentals.match(/b/g) || []).length;
                    const numSharps = (allAccidentals.match(/#/g) || []).length;

                    const finalTransposition = numSharps - numFlats;

                    let accidental = '';

                    if (finalTransposition >= 0) {
                        for (let x = 0; x < finalTransposition; x++) {
                            accidental += '#';
                        }
                    } else {
                        for (let x = 0; x < Math.abs(finalTransposition); x++) {
                            accidental += 'b';
                        }
                    }

                    let fullNoteName = noteName + (accidental || '');

                    if(fullNoteName === 'G##') fullNoteName = 'A';
                    if(fullNoteName === 'D##') fullNoteName = 'E';
                    if(fullNoteName === 'F##') fullNoteName = 'G';
                    if(fullNoteName === 'C##') fullNoteName = 'D';
                    if(fullNoteName === 'A##') fullNoteName = 'B';
                    if(fullNoteName === 'E##') fullNoteName = 'F#';
                    if(fullNoteName === 'B##') fullNoteName = 'C#';

                    if(fullNoteName === 'E#') fullNoteName = 'F';
                    if(fullNoteName === 'B#') fullNoteName = 'C';

                    notes.push(fullNoteName);

                    // let teoriaNote = null;

                    // try {
                    //     teoriaNote = teoria.note(fullNoteName);
                    // } catch (e) {
                    //     console.log(fullNoteName);
                    // }

                    // notes.push({
                    //     name: fullNoteName,
                    //     note: teoriaNote
                    // });

                })

                const chord = {
                    name: chordName,
                    notes,
                    aka,
                    family: chordData.family,
                }

                scalesNotes.forEach((sn)=>{
                    l++;
                });

                chords.push(chord);

            });

        })

        console.log(l);

        return chords;

    },

    getNoteAlternative: (note)=>{
        const alternatives = {
            'C': 'B#',
            'C#': 'Db',
            'Db': 'C#',
            'D#': 'Eb',
            'Eb': 'D#',
            'E': 'Fb',
            'F': 'E#',
            'F#': 'Gb',
            'Gb': 'F#',
            'G#': 'Ab',
            'Ab': 'G#',
            'A#': 'Bb',
            'Bb': 'A#',
            'B#': 'C',
        };
        return alternatives[note] ? alternatives[note] : null;
    },

    startChord: (chord, meforak)=>{

        const allNotes = 'CDEFGAB'.split('');
        const notes = [];

        let octave = 3;
        let indexOfLast;

        chord.notes.forEach((note, id)=>{
            const index = allNotes.indexOf(note);
            if(!id) indexOfLast = index;
            else{
                if(index < indexOfLast) {
                    octave++;
                    indexOfLast = index;
                }
            }
            notes.push(`${note}${octave}`);
        });

        const fqs = notes.map((note)=>(teoria.note(note).fq()));

        if(meforak){
            fqs.forEach((fq, i)=>{
                console.log(fq);
                if(!i) return nigun.instruments.player.startFrequency(fq);
                setTimeout(()=>{
                    nigun.instruments.player.startFrequency(fq);
                }, i * 25);
            })
        }else{
            fqs.forEach(fq=>{
                nigun.instruments.player.startFrequency(fq);
            })
        }

    },

};

class Cache {
    constructor() {

    }

    get(name) {
        return localStorage.getItem(name);
    }

    set(name, value) {
        if (value !== null && typeof value == 'object') value = JSON.stringify(value);
        localStorage.setItem(name, value);
    }
}

window.cache = new Cache;