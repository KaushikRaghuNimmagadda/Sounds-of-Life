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
let baseFreq = 349.23;

// SCALES //
let scaleAug = [3,0,3,7,9,10,12,14,15,19];
let scaleMajor = [4,0,4,7,9,11,12,14,16,19];
let scaleMajAug = [4,0,4,6,7,9,12,14,18,19];
let scaleMinor = [3,0,3,7,8,10,12,15,17,19];
let scaleArabic = [4,0,4,7,8,10,12,16,17,19];
let scaleArabic2 = [4,0,4,5,7,8,10,12,13,16];
let scaleGuXian = [3,0,3,5,7,10,12,15,17,19];
let scaleAkebono = [3,0,3,7,8,12,14,15,19,20];
let scales = [scaleArabic,scaleAkebono,scaleMajor,scaleAug,scaleMajAug,scaleMinor,scaleArabic2,scaleGuXian];
let selectedScale = 2;


let notes = produceNoteArr();
let sd = produceSoundDict();

let synth = new Tone.Synth();

let pingPong = new Tone.PingPongDelay(0.16, 0.2).toMaster();
let filter = new Tone.Filter(700, "lowpass").connect(pingPong);
let poly = new Tone.PolySynth(20, Tone.MonoSynth).connect(filter);
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

let env_size = 10;

var env = new Array(env_size);
var osc = new Array(env_size);
initEnvAndOsc();

// consumes a board, plays a sound!
function playSound(board, rows, cols) {
    console.log("playing sound");
    // let coverage = getCoverage(board, rows, cols);
    // console.log(coverage);
    // let fixedCoverage = Math.floor(coverage * 100);
    // let note = getNote(coverage);
    // console.log(note);
    // synth.toMaster().triggerAttackRelease(note, "8n", "+0.1");
    // console.log(fixedCoverage);
    // env[fixedCoverage].toMaster().triggerAttackRelease();
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

// produces array of envelopes
function initEnvAndOsc() {
    console.log("INITING ENV/OSC");
    let env_params = {};
    env_params["attack"] = 0.8;
    env_params["decay"] = 0.01;
    env_params["sustain"] = 0.5;
    env_params["release"] = 2.6;
    for(let i = 0; i < env_size; i ++) {
        osc[i] = new Tone.Oscillator(intToFreq(scales[selectedScale][i]));
        env[i] = new Tone.Envelope(env_params);
        // env[i].connect(osc[i].output.gain);
        // osc[i].start();
    }
    console.log(env);
    console.log(osc);
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

function intToFreq(int) {
    return Math.pow(2, int/12) * baseFreq;
}
