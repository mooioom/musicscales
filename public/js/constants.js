export const OSCILLATOR_TYPES = {
    SINE: 'sine',
    TRIANGLE: 'triangle',
    SQUARE: 'square',
    SAWTOOTH: 'sawtooth',
};

export const ALL_SCALES = [{
    title: "Acoustic",
    steps: [
        1,
        1,
        1,
        0.5,
        1,
        0.5,
        1
    ]
},
{
    title: "Aeolian",
    steps: [
        1,
        0.5,
        1,
        1,
        0.5,
        1,
        1
    ]
},
{
    title: "Algerian",
    steps: [
        1,
        0.5,
        1.5,
        0.5,
        0.5,
        1.5,
        0.5,
        1,
        0.5,
        1
    ]
},
{
    title: "Altered",
    steps: [
        0.5,
        1,
        0.5,
        1,
        1,
        1,
        1
    ]
},
{
    title: "Augmented",
    steps: [
        1.5,
        0.5,
        1.5,
        0.5,
        1.5,
        0.5
    ]
},
{
    title: "Bebop",
    steps: [
        1,
        1,
        0.5,
        1,
        1,
        0.5,
        0.5,
        0.5
    ]
},
{
    title: "Blues",
    steps: [
        1.5,
        1,
        0.5,
        0.5,
        1.5,
        1
    ]
},
{
    title: "Dorian",
    steps: [
        1,
        0.5,
        1,
        1,
        1,
        0.5,
        1
    ]
},
{
    title: "Double Harmonic",
    steps: [
        0.5,
        1.5,
        0.5,
        1,
        0.5,
        1.5,
        0.5
    ],
    modes: [
        "",
        "Lydian #2 #6",
        "Ultraphrygian",
        "Hungarian Minor",
        "Oriental",
        "Ionian #2 #5",
        "Locrian bb3 bb7"
    ],
},
{
    title: "Enigmatic",
    steps: [
        0.5,
        1.5,
        1,
        1,
        1,
        0.5,
        0.5
    ]
},
{
    title: "Flamenco",
    steps: [
        0.5,
        1.5,
        0.5,
        1,
        0.5,
        1.5,
        0.5
    ]
},
{
    title: "Gypsy",
    steps: [
        1,
        0.5,
        1.5,
        0.5,
        0.5,
        1,
        1
    ]
},
{
    title: "Half diminished",
    steps: [
        1,
        0.5,
        1,
        0.5,
        1,
        1,
        1
    ]
},
{
    title: "Harmonic major",
    steps: [
        1,
        1,
        0.5,
        1,
        0.5,
        1.5,
        0.5
    ]
},
{
    title: "Harmonic minor",
    steps: [
        1,
        0.5,
        1,
        1,
        0.5,
        1.5,
        0.5
    ]
},
{
    title: "Hirajoshi",
    steps: [
        2,
        1,
        0.5,
        2,
        0.5
    ]
},
{
    title: "Hungarian gypsy",
    steps: [
        1,
        0.5,
        1.5,
        0.5,
        0.5,
        1.5,
        0.5
    ]
},
{
    title: "Hungarian major",
    steps: [
        1.5,
        0.5,
        1,
        0.5,
        1,
        0.5,
        1
    ]
},
{
    title: "In",
    steps: [
        0.5,
        2,
        1,
        0.5,
        2
    ]
},
{
    title: "Insen",
    steps: [
        0.5,
        2,
        1,
        1.5,
        1
    ]
},
{
    title: "Ionian",
    steps: [
        1,
        1,
        0.5,
        1,
        1,
        1,
        0.5
    ]
},
{
    title: "Istrian",
    steps: [
        0.5,
        1,
        0.5,
        1,
        0.5,
        2.5
    ]
},
{
    title: "Istrian 2nd",
    steps: [
        0.5,
        1,
        0.5,
        1,
        1,
        2
    ]
},
{
    title: "Iwato",
    steps: [
        0.5,
        2,
        0.5,
        2,
        1
    ]
},
{
    title: "Locrian",
    steps: [
        0.5,
        1,
        1,
        0.5,
        1,
        1,
        1
    ]
},
{
    title: "Lydian augmented",
    steps: [
        1,
        1,
        1,
        1,
        0.5,
        1,
        0.5
    ]
},
{
    title: "Lydian diminished",
    steps: [
        1,
        0.5,
        1.5,
        0.5,
        0.5,
        1,
        0.5
    ]
},
{
    title: "Lydian",
    steps: [
        1,
        1,
        1,
        0.5,
        1,
        1,
        0.5
    ]
},
{
    title: "Bebop",
    steps: [
        1,
        1,
        0.5,
        1,
        0.5,
        0.5,
        1,
        0.5
    ]
},
{
    title: "Major Locrian",
    steps: [
        1,
        1,
        0.5,
        0.5,
        1,
        1,
        1
    ]
},
{
    title: "Adonai Malakh",
    steps: [
        1,
        1,
        0.5,
        1,
        1,
        0.5,
        1
    ]
},
{
    title: "Mixolydian",
    steps: [
        1,
        1,
        0.5,
        1,
        1,
        0.5,
        1
    ]
},
{
    title: "Neapolitan major",
    steps: [
        0.5,
        1,
        1,
        1,
        1,
        1,
        0.5
    ]
},
{
    title: "Neapolitan minor",
    steps: [
        0.5,
        1,
        1,
        1,
        0.5,
        1.5,
        0.5
    ]
},
{
    title: "Octatonic",
    steps: [
        1,
        0.5,
        1,
        0.5,
        1,
        0.5,
        1,
        0.5
    ]
},
{
    title: "Persian",
    steps: [
        0.5,
        1.5,
        0.5,
        0.5,
        1,
        1.5,
        0.5
    ]
},
{
    title: "Phrygian dominant",
    steps: [
        0.5,
        1.5,
        0.5,
        1,
        0.5,
        1,
        1
    ]
},
{
    title: "Phrygian",
    steps: [
        0.5,
        1,
        1,
        1,
        0.5,
        1,
        1
    ]
},
{
    title: "Prometheus",
    steps: [
        1,
        1,
        1,
        1.5,
        0.5,
        1
    ]
},
{
    title: "Scale of harmonics",
    steps: [
        1.5,
        0.5,
        0.5,
        1,
        1,
        1.5
    ]
},
{
    title: "Tritone",
    steps: [
        0.5,
        1.5,
        1,
        0.5,
        1.5,
        1
    ]
},
{
    title: "Ukrainian Dorian",
    steps: [
        1,
        0.5,
        1.5,
        0.5,
        1,
        0.5,
        1
    ]
},
{
    title: "Vietnamese",
    steps: [
        1.25,
        0.25,
        0.5,
        0.5,
        1
    ]
},
{
    title: "Whole tone",
    steps: [
        1,
        1,
        1,
        1,
        1,
        1
    ]
},
{
    title: "Yo",
    steps: [
        1.5,
        1,
        1,
        1.5,
        1
    ]
}
]

export const SCALES = {
    'MAJOR': {
        title: 'Major',
        steps: [1, 1, 0.5, 1, 1, 1, 0.5],
        modes: [
            'Ionian',
            'Dorian',
            'Phrygian',
            'Lydian',
            'Mixolydian',
            'Aeolian',
            'Locrian',
        ]
    },
    'MINOR': {
        title: 'Minor',
        steps: [1, 0.5, 1, 1, 0.5, 1, 1],
    },
    'HARMONIC_MINOR': {
        title: 'Harmonic Minor',
        steps: [1, 0.5, 1, 1, 0.5, 1.5, 0.5]
    },
    'MELODIC_MINOR': {
        title: 'Melodic Minor',
        steps: [1, 0.5, 1, 1, 1, 1, 0.5],
        modes: [
            '',
            'Dorian b2',
            'Lydian Augmented',
            'Lydian Dominant',
            'Mixolydian b6',
            'Half Diminished',
            'Super Locrian',
        ],
    },
    'MAJOR_PENTATONIC': {
        title: 'Pentatonic (Major)',
        steps: [1, 1, 1.5, 1, 1.5],
        noSequencialNotation: true,
    },
    'MINOR_PENTATONIC': {
        title: 'Pentatonic (Minor)',
        steps: [1.5, 1, 1, 1.5, 1],
        noSequencialNotation: true,
    },
    'HUNGARIAN_MINOR': {
        title: 'Hungarian Minor',
        steps: [1, 0.5, 1.5, 0.5, 0.5, 1.5, 0.5]
    },
    'SHALOM_ALECHEM': {
        title: 'Shalom Alechem',
        steps: [0.5, 1.5, 0.5, 1, 0.5, 1, 1],
    },
    'BLUES': {
        title: 'Blues',
        steps: [1.5, 1, 0.5, 0.5, 1.5, 1],
        noSequencialNotation: true,
    },
    'ACOUSTIC_SCALE': {
        title: 'Acoustic',
        steps: [1, 1, 1, 0.5, 1, 0.5, 1],
    },
    'MAQAM_BAYATI': {
        title: 'Bayati',
        steps: [0.75, 0.75, 1, 1, 0.5, 1, 1],
    },
    'MAQAM_BAYATI_RAST': {
        title: 'Bayati (Rast)',
        steps: [0.75, 0.75, 1, 1, 0.75, 0.75, 1]
    },
    'MAQAM_HIJAZ_RAST': {
        title: 'Hijaz (Rast)',
        steps: [0.5, 1.5, 0.5, 1, 0.75, 0.75, 1]
    },
    'MAQAM_HIJAZ_NAHAWAND': {
        title: 'Hijaz (Nahawand)',
        steps: [0.5, 1.5, 0.5, 1, 0.5, 1, 1]
    },
    'MAQAM_HIJAZ_KAR': {
        title: 'Hijaz Kar',
        steps: [0.5, 1.5, 0.5, 1, 0.5, 1.5, 0.5]
    },
    'MAQAM_KURD': {
        title: 'Kurd',
        steps: [0.5, 1, 1, 1, 0.5, 1, 1]
    },
    'MAQAM_NAHAWAND': {
        title: 'Nahawand',
        steps: [1, 0.5, 1, 1, 0.5, 1, 1]
    },
    'MAQAM_RAST': {
        title: 'Rast',
        steps: [1, 0.75, 0.75, 1, 1, 0.75, 0.75]
    },
    'MAQAM_SABA': {
        title: 'Saba',
        steps: [0.75, 0.75, 0.5, 1.5, 0.5, 1, 1]
    },
    'MAQAM_SIKAH': {
        title: 'Sikah',
        steps: [0.75, 1, 1, 0.75, 0.75, 1, 0.75]
    },
    'MAQAM_SIKAH_TURKISH': {
        title: 'Sikah (Turkish)',
        steps: [0.75, 1, 0.75, 1, 0.75, 1.25, 0.5]
    },
    'MAQAM_HUSAYNI': {
        title: 'Husayni',
        steps: [0.75, 0.75, 1, 1, 0.75, 0.75, 1],
    },
    'MAQAM_NIKRIZ': {
        title: 'Nikriz',
        steps: [1, 0.5, 1.5, 0.5, 1, 0.5, 1],
    },
    'AUGMENTED': {
        title: 'Augmented',
        steps: [1.5, 0.5, 1.5, 0.5, 1.5, 0.5]
    },
    'BEBOP_DOMINANT': {
        title: 'Bebop Dominant',
        steps: [1, 1, 0.5, 1, 1, 0.5, 1]
    },
    'DOUBLE_HARMONIC': {
        title: 'Double Harmonic',
        steps: [0.5, 1.5, 0.5, 1, 0.5, 1.5, 0.5]
    },
    'ENIGMATIC': {
        title: 'Enigmatic',
        steps: [0.5, 1.5, 1, 1, 1, 0.5, 0.5]
    },
    'FLAMENCO': {
        title: 'Flamenco',
        steps: [0.5, 1.5, 0.5, 1, 0.5, 1.5, 0.5]
    },
    'GYPSY': {
        title: 'Gypsy',
        steps: [1, 0.5, 1.5, 0.5, 0.5, 1, 1]
    },
    'WHOLE_TONE': {
        title: 'Whole Tone',
        steps: [1, 1, 1, 1, 1, 1]
    },
    'YO': {
        title: 'Yo (Min\'yō)',
        steps: [1.5, 1, 1, 1.5, 1]
    },
    // 'New Major': {
    //     title: 'New Major',
    //     steps: [1, 1, 0.5, 1, 1.5, 0.5, 0.5]
    // },
    // 'New Gypsy': {
    //     title: 'New Gypsy',
    //     steps: [1, 0.5, 1.25, 0.75, 0.5, 1, 1]
    // },
}

// console.log(ALL_SCALES);

ALL_SCALES.forEach(s=>{
    SCALES[s.title.replace(/\s+/g, '_').toUpperCase()] = {
        title: s.title,
        steps: s.steps,
        noSequencialNotation: s.steps.length !== 7,
        modes: s.modes,
    }
});

export const shiftLeft = (arr = [], n) => {
    let a = [...arr];
    for (let i = 0; i < n; i++) {
        const first = a.shift();
        a.push(first);
    }
    return a;
}

export const formatString = str => str.replace(/[^a-z0-9\s]/gi, '').replace(/\s/g, '_').toUpperCase();

Object.keys(SCALES).forEach((s)=>{
    const scale = SCALES[s];
    if(scale.modes){
        scale.modes.forEach((m, idx)=>{
            if(!m) return;
            SCALES[ formatString(m) ] = {
                title: m,
                steps: shiftLeft(scale.steps, idx),
            }
        });
    }
})

export const TET24 = new Array(24).fill(0.25);

export const ACCIDENTALS = {
    FLAT: 'FLAT',
    SHARP: 'SHARP',
    DOUBLE_FLAT: 'DOUBLE_FLAT',
    DOUBLE_SHARP: 'DOUBLE_SHARP',
    HALF_FLAT: 'HALF_FLAT',
    HALF_SHARP: 'HALF_SHARP',
}

export const ACCIDENTALS_CHARACTERS = {
    [ACCIDENTALS.FLAT]: '♭',
    [ACCIDENTALS.SHARP]: '♯',
    [ACCIDENTALS.DOUBLE_FLAT]: '𝄫',
    [ACCIDENTALS.DOUBLE_SHARP]: '𝄪',
    [ACCIDENTALS.HALF_FLAT]: '𝄳',
    [ACCIDENTALS.HALF_SHARP]: '𝄲',
};

export const MODE_SHIFTS = {
    IONIAN: 0, // major
    DORIAN: 1,
    PHRYGIAN: 2,
    LYDIAN: 3,
    MIXOLYDIAN: 4,
    AEOLIAN: 5, // minor
    LOCRIAN: 6,
}

export const CHORDS = {
    1: [1, 3, 5],
    2: [2, 4, 6],
    3: [3, 5, 7],
    4: [4, 6, 8],
    5: [5, 7, 9],
    6: [6, 8, 10],
    7: [7, 9, 11],
};

const chord = (n = 1, l = 'w') => {
    const c = CHORDS[n];
    return c.map(a => `${a}${l}`);
}

export const SEQUENCER_PATTERNS = {
    UP: [1, 2, 3, 4, 5, 6, 7, 8],
    DOWN: [8, 7, 6, 5, 4, 3, 2, 1],
    ARPEGGIO: [1, 3, 5, 8],
    STEPPER: [1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7, 6, 7, 8],
    INTERVAL: [1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8],
    DOUBLE: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    UP_PAIR: ['1h', '1h', '2h', '2h', '3h', '3h', '4h', '4h', '5h', '5h', '6h', '6h', '7h', '7h', '8h', '8h', ],
    SECOND: [1, 2],
    THIRD: [1, 3],
    FORTH: [1, 4],
    FIFTH: [1, 5],
    SIXTH: [1, 6],
    SEVENTH: [1, 7],
    OCTAVE: [1, 8],
    UP_OCTAVE: [
        [1, 8],
        [2, 9],
        [3, 10],
        [4, 11],
        [5, 12],
        [6, 13],
        [7, 14],
        [8, 15]
    ],
    UP_OCTAVE_DOUBLE: [1, 8, 15],
    UP_FIFTH: [1, 5, 8],
    // CHORD: [
    //     CHORDS[1],
    // ],
    // '1-6-4-5': [
    //     chord(1, 'w'), chord(1, 'w'),
    //     chord(6, 'w'), chord(6, 'w'),
    //     chord(4, 'w'), chord(4, 'w'),
    //     chord(5, 'w'), chord(5, 'w')
    // ],
};

export const NOTE_LENGTHS = {
    OCTUPLE: 8,
    QUADRUPLE: 4,
    TRIPLE: 3,
    DOUBLE: 2,
    WHOLE: 1,
    HALF: 1 / 2,
    TRIPLET: 1 / 3,
    QUARTER: 1 / 4,
    EIGHTH: 1 / 8,
    SIXTEENTH: 1 / 16,
};

export const LETTERS_TO_LENGTH = {
    d: NOTE_LENGTHS.DOUBLE,
    w: NOTE_LENGTHS.WHOLE,
    h: NOTE_LENGTHS.HALF,
    t: NOTE_LENGTHS.TRIPLET,
    q: NOTE_LENGTHS.QUARTER,
    e: NOTE_LENGTHS.EIGHTH,
    s: NOTE_LENGTHS.SIXTEENTH,
    r: NOTE_LENGTHS.QUADRUPLE,
}

export const TRANSFORMATION_TYPES = {
    EXTEND: 'extend',
    MIRROR: 'mirror'
}

export const PROGRAMS = {
    'UP': {
        loop: true,
        title: 'Going up',
        steps: [
            {
                pattern: 'UP'
            },
        ],
    },
    // 'PRACTICE_1': {
    //     loop: true,
    //     title: 'Scale Practice 1',
    //     description: 'Basic scale practice routine, transposes a tone up every 2 reps.',
    //     steps: [{
    //             pattern: 'UP'
    //         },
    //         {
    //             pattern: 'UP',
    //             patternSettings: {
    //                 double: true,
    //             },
    //             title: 'A Part', // not required
    //             description: 'A Part', // not required
    //             scale: 'MINOR', // static scale - not required
    //             mode: 1, // set mode
    //             key: 1, // transpose key by 1 tone up
    //             position: 1, // scale starting position
    //             tempoAdd: 20, // tempo transposition
    //             tempo: 20, // static tempo
    //             repeat: 2,
    //         },
    //     ],
    // },
    // 'PROGRESSION_1': {
    //     loop: true,
    //     title: 'Progression 1',
    //     description: 'I-III-VI-V',
    //     steps: [{
    //             pattern: 'ARPEGGIO',
    //             position: 1,
    //             repeat: 2,
    //         },
    //         {
    //             pattern: 'ARPEGGIO',
    //             position: 3,
    //             repeat: 2,
    //         },
    //         {
    //             pattern: 'ARPEGGIO',
    //             position: 6,
    //             repeat: 2,
    //         },
    //         {
    //             pattern: 'ARPEGGIO',
    //             position: 5,
    //             repeat: 2,
    //         },
    //     ],
    // },
};