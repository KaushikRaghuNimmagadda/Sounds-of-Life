let notes = produceNoteArr();
let sd = produceSoundDict();

let synth = new Tone.Synth().toMaster();
// consumes a board, plays a sound!
function playSound(board, rows, cols) {
    console.log("playing sound");
    let alive = 0;
    for(const key of Object.keys(board)) {
        if(board[key]) {
            alive ++;
        }
    }
    let coverage = alive / (rows * cols);
    console.log(coverage);
    let note = getNote(coverage);
    console.log(note);
    // synth.triggerAttackRelease("A#4", "8n");
    // synth.triggerAttackRelease(note, "8n");
    synth.triggerAttackRelease(note, "8n", "+0.1");
}

function produceSoundDict() {
    let d = new Map();
    for(let i = 0; i < 48; i ++) {
        d[i/48] = notes[i%12] + "4";
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
