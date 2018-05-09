/**
 * Ideas for how this will determine sound:
 * Cell frequencies
 * Cell positions
 * Cell structures (i.e. size of clusters, shape of clusters, etc.)
 */

/**
 * Ideas for how sound can change
 * Notes
 * Durations
 * Combinations of notes/have multiple notes played vs. 1 note played
 */

let notes = produceNoteArr();
let sd = produceSoundDict();

let pingPong = new Tone.PingPongDelay(0.16, 0.2).toMaster();
let filter = new Tone.Filter(500, "lowpass").connect(pingPong);
let poly = new Tone.PolySynth(10, Tone.MonoSynth).connect(filter);
// let poly = new Tone.PolySynth(10, Tone.AMSynth).connect(filter);
poly.set({
    volume: -35,
    oscillator: {
        type: "square"
    },
    filter: {
       Q: 3,
       type: "allpass",
       rolloff: -24
    },
    envelope: {
        attack: 0.3,
        decay: 0,
        sustain: 1,
        release: 0.3
    },
    filterEnvelope: {
        attack: 0.2,
        decay: 0,
        sustain: 1,
        release: 0.2,
        min: 20,
        max: 20,
        exponent: 2,
    }
});

// consumes a board, plays a sound!
function playSound(board, rows, cols) {
    console.log("playing sound");
    playPoly(board, rows, cols);
}

function playPoly(board, rows, cols) {
    poly.set("detune", ~~(Math.random() * 10 - 5));
    for(let r = 0; r < rows; r ++) {
        for(let c = 0; c < cols; c ++) {
            let key = [r, c];
            if(board[key]) {
                poly.triggerAttackRelease((r%10 + 1) * (c%15 + 1) * 33, 0.12);
            }
        }
    }
}

function produceSoundDict() {
    let d = new Map();
    let num_intervals = 192 * 2;
    for(let i = 0; i < num_intervals; i ++) {
        d[i/num_intervals] = notes[i%notes.length] + "4";
    }
    return d
}

function produceNoteArr() {
    let arr = [];
    arr.push("A");
    arr.push("A#");
    arr.push("B");
    arr.push("C");
    arr.push("C#");
    arr.push("D");
    arr.push("D#");
    arr.push("E");
    arr.push("F");
    arr.push("F#");
    arr.push("G");
    arr.push("G#");
    return arr
}

// given a coverage percentage calculates the note to play.
function getNote(coverage) {
    console.log(sd);
    let sorted_keys = Object.keys(sd).sort();
    for(let i = 0; i < sorted_keys.length - 1; i ++) {
        if(coverage > sorted_keys[i] && coverage <= sorted_keys[i + 1]) {
            return sd[sorted_keys[i]];
        }
    }
    return sd[sorted_keys.length - 1];
}
