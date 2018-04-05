function getCoverage(board, rows, cols) {
    let alive = 0;
    for(const key of Object.keys(board)) {
        if(board[key]) {
            alive ++;
        }
    }
    return alive / (rows * cols);
}

// gets number of cell clusters on the board
function getNumClusters(board, rows, cols) {
    let count = 0;
    // next color to paint with in flood fill
    let nextToken = 1;
    // set up buffer vector
    let vec = Array(cols).fill(0);
    for(let r = 0; r < rows; r ++) {
        let current = 0;
        for(let c = 0; c < cols; c ++) {
            let key = [r, c];
            if(!board[key]) {
                // cell not filled
                current = 0;
            } else {
                // cell filled
                if(current !== 0 && vec[c] !== 0 && current !== vec[c]) {
                    // this means the current cell can be colored in two ways, so two connected areas
                    // are merging. Thus, we can decrement count.
                    count --;
                } else {
                    current = Math.max(current, vec[c]);
                    if(current === 0) {
                        current = nextToken;
                        nextToken ++;
                        count ++;
                    }
                }
            }
            vec[c] = current;
        }
    }
    return count
}