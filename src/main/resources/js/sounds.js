// consumes a board, plays a sound!
function playSound(board) {
    console.log("playing sound");
    let VCO = T("saw", {mul: 0.2});
    let VCF = T("lpf", {cutoff: 1600, Q:10}, VCO).play();
}

/**
 * Ideas for how this will determine sound:
 * Cell frequencies
 * Cell positions
 * Cell structures (i.e. size of clusters, shape of clusters, etc.)
 */
