export const OSCILLATOR_TYPES = {
    SINE: 'sine',
    TRIANGLE: 'triangle',
    SQUARE: 'square',
    SAWTOOTH: 'sawtooth',
};

export const ALL_SCALES = [{
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
        title: 'Pentatonic Major',
        steps: [1, 1, 1.5, 1, 1.5],
        noSequencialNotation: true,
    },
    'MINOR_PENTATONIC': {
        title: 'Pentatonic Minor',
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
    'MAQAM_AJAM': {
        title: 'Ajam',
        originalNote: 'C',
        steps: [1, 1, 0.5, 1, 1, 1, 0.5],
    },
    'MAQAM_AJAM_NAHAWAND': {
        title: 'Ajam (Nahawand)',
        originalNote: 'C',
        steps: [1, 1, 0.5, 1, 1, 0.5, 1],
    },
    'MAQAM_AJAM_USHAYRAN': {
        title: 'Ajam Ushayran',
        originalNote: 'Bb',
        steps: [1, 1, 0.5, 1, 1, 1, 0.5],
    },
    'MAQAM_ATHAR_KURD': {
        title: 'Athar Kurd',
        steps: [0.5, 1, 1.5, 0.5, 0.5, 1.5, 0.5]
    },
    'MAQAM_AWJ_IRAQ': {
        title: 'Awj Iraq',
        steps: [0.75, 1, 0.5, 1.5, 0.5, 1.5, 0.25]
    },
    'MAQAM_BAYATI': {
        title: 'Bayati',
        steps: [0.75, 0.75, 1, 1, 0.5, 1, 1],
    },
    'MAQAM_BAYATI_SHURI': {
        title: 'Bayati Shuri',
        steps: [0.75, 0.75, 1, 0.5, 1.5, 0.5, 1],
    },
    'MAQAM_BAYATI_RAST': {
        title: 'Bayati (Rast)',
        steps: [0.75, 0.75, 1, 1, 0.75, 0.75, 1]
    },
    'MAQAM_FARAHFAZA': {
        title: 'Farahfaza',
        steps: [1, 0.5, 1, 1, 0.5, 1.5, 0.5]
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
        steps: [1, 0.5, 1, 1, 0.5, 1.5, 0.5]
    },
    'MAQAM_RAST': {
        title: 'Rast',
        steps: [1, 0.75, 0.75, 1, 1, 0.75, 0.75]
    },
    'MAQAM_SUZNAK': {
        title: 'Suznak',
        steps: [1, 0.75, 0.75, 1, 0.5, 1.5, 0.5]
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
    'MAQAM_IRAQ': {
        title: 'Iraq',
        steps: [0.75, 1, 0.75, 0.75, 1, 1, 0.75]
    },
    'MAQAM_HUZAM': {
        title: 'Huzam',
        steps: [0.75, 1, 0.5, 1.5, 0.5, 1, 0.75]
    },
    'MAQAM_HUSAYNI': {
        title: 'Husayni',
        steps: [0.75, 0.75, 1, 1, 0.75, 0.75, 1],
    },
    'MAQAM_NIKRIZ': {
        title: 'Nikriz',
        steps: [1, 0.5, 1.5, 0.5, 1, 0.5, 1],
    },
    'MAQAM_JIHARKAH': {
        title: 'Jiharkah',
        originalNote: 'e𝄳',
        steps: [0.75, 1, 1, 0.5, 1, 1, 0.75],
    },
    'MAQAM_NAWA_ATHAR': {
        title: 'Nawa Athar',
        originalNote: 'c',
        steps: [1, 0.5, 1.5, 0.5, 0.5, 1.5, 0.5],
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

export const TET12 = new Array(12).fill(0.5);

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

export const _CHORDS = {
    1: [1, 3, 5],
    2: [2, 4, 6],
    3: [3, 5, 7],
    4: [4, 6, 8],
    5: [5, 7, 9],
    6: [6, 8, 10],
    7: [7, 9, 11],
};

const chord = (n = 1, l = 'w') => {
    const c = _CHORDS[n];
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

export const CHORDS = [
    {
        "family": "Major",
        "name": "maj",
        "intervals": [
            "1",
            "3",
            "5"
        ],
        "aka": [
            "major"
        ]
    },
    {
        "family": "Major",
        "name": "2",
        "intervals": [
            "1",
            "2",
            "5"
        ],
        "aka": [
            "sus2"
        ]
    },
    {
        "family": "Major",
        "name": "4",
        "intervals": [
            "1",
            "4",
            "5"
        ],
        "aka": [
            "sus4",
            " m(sus4)"
        ]
    },
    {
        "family": "Major",
        "name": "(b5)",
        "intervals": [
            "1",
            "3",
            "b5"
        ],
        "aka": []
    },
    {
        "family": "Major",
        "name": "6",
        "intervals": [
            "1",
            "3",
            "5",
            "6"
        ],
        "aka": [
            "add6",
            "maj6",
            "add13"
        ]
    },
    {
        "family": "Major",
        "name": "maj7",
        "intervals": [
            "1",
            "3",
            "5",
            "7"
        ],
        "aka": [
            "j7",
            "M7",
            "Δ"
        ]
    },
    {
        "family": "Major",
        "name": "maj7(b5)",
        "intervals": [
            "1",
            "3",
            "b5",
            "7"
        ],
        "aka": []
    },
    {
        "family": "Major",
        "name": "maj7(#5)",
        "intervals": [
            "1",
            "3",
            "#5",
            "7"
        ],
        "aka": []
    },
    {
        "family": "Major",
        "name": "add9",
        "intervals": [
            "1",
            "3",
            "5",
            "9"
        ],
        "aka": [
            "add2"
        ]
    },
    {
        "family": "Major",
        "name": "add11",
        "intervals": [
            "1",
            "3",
            "5",
            "11"
        ],
        "aka": [
            "add4"
        ]
    },
    {
        "family": "Major",
        "name": "6/9",
        "intervals": [
            "1",
            "3",
            "5",
            "6",
            "9"
        ],
        "aka": [
            "maj6/9"
        ]
    },
    {
        "family": "Major",
        "name": "maj7(b9)",
        "intervals": [
            "1",
            "3",
            "5",
            "7",
            "b9"
        ],
        "aka": []
    },
    {
        "family": "Major",
        "name": "maj7(#9)",
        "intervals": [
            "1",
            "3",
            "5",
            "7",
            "#9"
        ],
        "aka": []
    },
    {
        "family": "Major",
        "name": "maj7/#11",
        "intervals": [
            "1",
            "3",
            "5",
            "7",
            "#11"
        ],
        "aka": []
    },
    {
        "family": "Major",
        "name": "maj7/13",
        "intervals": [
            "1",
            "3",
            "5",
            "7",
            "13"
        ],
        "aka": []
    },
    {
        "family": "Major",
        "name": "maj9",
        "intervals": [
            "1",
            "3",
            "5",
            "7",
            "9"
        ],
        "aka": [
            "maj7/9"
        ]
    },
    {
        "family": "Major",
        "name": "6/9/#11",
        "intervals": [
            "1",
            "b3",
            "5",
            "6",
            "9",
            "#11"
        ],
        "aka": []
    },
    {
        "family": "Major",
        "name": "maj7(#9)11",
        "intervals": [
            "1",
            "3",
            "5",
            "7",
            "#9",
            "11"
        ],
        "aka": []
    },
    {
        "family": "Major",
        "name": "maj9/13",
        "intervals": [
            "1",
            "3",
            "5",
            "7",
            "9",
            "13"
        ],
        "aka": [
            "maj7/9/13"
        ]
    },
    {
        "family": "Major",
        "name": "maj11",
        "intervals": [
            "1",
            "3",
            "5",
            "7",
            "9",
            "11"
        ],
        "aka": [
            "maj7/9/11",
            " maj9/11"
        ]
    },
    {
        "family": "Minor",
        "name": "m",
        "intervals": [
            "1",
            "b3",
            "5"
        ],
        "aka": [
            "min",
            "minor"
        ]
    },
    {
        "family": "Minor",
        "name": "m6",
        "intervals": [
            "1",
            "b3",
            "5",
            "6"
        ],
        "aka": [
            "min6"
        ]
    },
    {
        "family": "Minor",
        "name": "m7",
        "intervals": [
            "1",
            "b3",
            "5",
            "b7"
        ],
        "aka": [
            "-7",
            " mi7",
            " min7"
        ]
    },
    {
        "family": "Minor",
        "name": "m(maj7)",
        "intervals": [
            "1",
            "b3",
            "5",
            "7"
        ],
        "aka": [
            "m(j7)"
        ]
    },
    {
        "family": "Minor",
        "name": "m(add9)",
        "intervals": [
            "1",
            "b3",
            "5",
            "9"
        ],
        "aka": [
            "m(add2)"
        ]
    },
    {
        "family": "Minor",
        "name": "m(add11)",
        "intervals": [
            "1",
            "b3",
            "5",
            "11"
        ],
        "aka": [
            "m(add4)"
        ]
    },
    {
        "family": "Minor",
        "name": "m6/9",
        "intervals": [
            "1",
            "b3",
            "5",
            "6",
            "9"
        ],
        "aka": [
            "min6/9"
        ]
    },
    {
        "family": "Minor",
        "name": "m7/11",
        "intervals": [
            "1",
            "b3",
            "5",
            "b7",
            "11"
        ],
        "aka": [
            "min7/11"
        ]
    },
    {
        "family": "Minor",
        "name": "m7/11(b5)",
        "intervals": [
            "1",
            "b3",
            "b5",
            "b7",
            "11"
        ],
        "aka": [
            "min7/11(b5)"
        ]
    },
    {
        "family": "Minor",
        "name": "m7/b13",
        "intervals": [
            "1",
            "b3",
            "5",
            "b7",
            "b13"
        ],
        "aka": [
            "min7/b13"
        ]
    },
    {
        "family": "Minor",
        "name": "m7/13",
        "intervals": [
            "1",
            "b3",
            "5",
            "b7",
            "13"
        ],
        "aka": [
            "min7/13"
        ]
    },
    {
        "family": "Minor",
        "name": "m(maj9)",
        "intervals": [
            "1",
            "b3",
            "5",
            "7",
            "9"
        ],
        "aka": [
            "m(j9)"
        ]
    },
    {
        "family": "Minor",
        "name": "m9",
        "intervals": [
            "1",
            "b3",
            "5",
            "b7",
            "9"
        ],
        "aka": [
            "min9"
        ]
    },
    {
        "family": "Minor",
        "name": "m6/9/11",
        "intervals": [
            "1",
            "b3",
            "5",
            "6",
            "9",
            "11"
        ],
        "aka": [
            "min6/9/11"
        ]
    },
    {
        "family": "Minor",
        "name": "m11",
        "intervals": [
            "1",
            "b3",
            "5",
            "b7",
            "9",
            "11"
        ],
        "aka": [
            "min11",
            " m7/9/11",
            " m9/11"
        ]
    },
    {
        "family": "Minor",
        "name": "m13",
        "intervals": [
            "1",
            "b3",
            "5",
            "b7",
            "9",
            "11",
            "13"
        ],
        "aka": [
            "min13"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "7",
        "intervals": [
            "1",
            "3",
            "5",
            "b7"
        ],
        "aka": [
            "dom7"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "7/4",
        "intervals": [
            "1",
            "4",
            "5",
            "b7"
        ],
        "aka": [
            "7sus4"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(b5)",
        "intervals": [
            "1",
            "3",
            "b5",
            "b7"
        ],
        "aka": [
            "Ø"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(#5)",
        "intervals": [
            "1",
            "3",
            "#5",
            "b7"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(b9)",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "b9"
        ],
        "aka": [
            "dom(b9)"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(b9)4",
        "intervals": [
            "1",
            "4",
            "5",
            "b7",
            "b9"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(#9)",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "#9"
        ],
        "aka": [
            "dom(#9)"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "7/11",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "11"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "7/#11",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "#11"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "7/b13",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "b13"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "7/13",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "13"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "9",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "9"
        ],
        "aka": [
            "dom9",
            " 7/9"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "9/4",
        "intervals": [
            "1",
            "4",
            "5",
            "b7",
            "9"
        ],
        "aka": [
            "9sus4",
            " 11/4",
            " 11sus4"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "9(b5)",
        "intervals": [
            "1",
            "3",
            "b5",
            "b7",
            "9"
        ],
        "aka": [
            "7/9(b5)",
            " 9(#11)"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "9(#5)",
        "intervals": [
            "1",
            "3",
            "#5",
            "b7",
            "9"
        ],
        "aka": [
            "7/9(#5)"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(b9)#11",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "b9",
            "#11"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(b9)b13",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "b9",
            "b13"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(b9)13",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "b9",
            "13"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(#9)#11",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "#9",
            "#11"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(#9)b13",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "#9",
            "b13"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "9/#11",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "9",
            "#11"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "9/b13",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "9",
            "b13"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "9/13",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "9",
            "13"
        ],
        "aka": [
            "9/6",
            " 7/9/13"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "13/4",
        "intervals": [
            "1",
            "4",
            "5",
            "b7",
            "9",
            "13"
        ],
        "aka": [
            "13sus4",
            " 9/13sus4"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "11",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "9",
            "11"
        ],
        "aka": [
            "dom11"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "11(b9)",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "b9",
            "11"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "11(#9)",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "#9",
            "11"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "7(#9)#11",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "#9",
            "#11"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "9/#11/13",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "9",
            "#11",
            "13"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "13",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "9",
            "11",
            "13"
        ],
        "aka": [
            "dom13"
        ]
    },
    {
        "family": "Dominant-Seventh",
        "name": "13(b9)",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "b9",
            "11",
            "13"
        ],
        "aka": []
    },
    {
        "family": "Dominant-Seventh",
        "name": "13(#9)",
        "intervals": [
            "1",
            "3",
            "5",
            "b7",
            "#9",
            "11",
            "13"
        ],
        "aka": []
    },
    {
        "family": "Diminished",
        "name": "°",
        "intervals": [
            "1",
            "b3",
            "b5"
        ],
        "aka": [
            "dim",
            " m(b5)"
        ]
    },
    {
        "family": "Diminished",
        "name": "°7",
        "intervals": [
            "1",
            "b3",
            "b5",
            "bb7"
        ],
        "aka": []
    },
    {
        "family": "Diminished",
        "name": "°7/b13",
        "intervals": [
            "1",
            "b3",
            "b5",
            "bb7",
            "b13"
        ],
        "aka": []
    },
    {
        "family": "Half-Diminished",
        "name": "m7(b5)",
        "intervals": [
            "1",
            "b3",
            "b5",
            "b7"
        ],
        "aka": [
            "mØ",
            " dim7",
            " min7(b5)"
        ]
    },
    {
        "family": "Augmented",
        "name": "+",
        "intervals": [
            "1",
            "3",
            "#5"
        ],
        "aka": [
            "(#5)",
            " aug"
        ]
    },
    {
        "family": "Powerchords",
        "name": "1-b3-x",
        "intervals": [
            "1",
            "b3"
        ],
        "aka": []
    },
    {
        "family": "Powerchords",
        "name": "1-3-x",
        "intervals": [
            "1",
            "3"
        ],
        "aka": []
    },
    {
        "family": "Powerchords",
        "name": "1-4-x",
        "intervals": [
            "1",
            "4"
        ],
        "aka": []
    },
    {
        "family": "Powerchords",
        "name": "1-x-b5",
        "intervals": [
            "1",
            "b5"
        ],
        "aka": []
    },
    {
        "family": "Powerchords",
        "name": "5",
        "intervals": [
            "1",
            "5"
        ],
        "aka": [
            "1-x-5"
        ]
    },
    {
        "family": "Powerchords",
        "name": "1-x-6",
        "intervals": [
            "1",
            "6"
        ],
        "aka": []
    },
    {
        "family": "Powerchords",
        "name": "1-x-b7",
        "intervals": [
            "1",
            "b7"
        ],
        "aka": []
    },
    {
        "family": "Powerchords",
        "name": "1-x-7",
        "intervals": [
            "1",
            "7"
        ],
        "aka": []
    }
]