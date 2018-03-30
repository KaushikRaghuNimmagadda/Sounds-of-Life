$(document).ready(() => {
    // map for colors
    let colors = {};
    colors[true] = "#00FF00";
    colors[false] = "#000000";
    // set run flag
    let run = false;
    // set button onclick
    let $runButton = $("#run");
    $runButton.click(() => {
        if(!run) {
            run = true;
            runLoop();
        } else {
            run = !run;
        }
    });
    let $clearButton = $("#clear");
    $clearButton.click(() => {
        run = false;
        drawDeadBoard();
    });
    // bind enter to update board
    $(document).onkeypress = function (event) {
       if (event.keyCode == 13) {
           updateBoard()
       }
    };


    const squareSize = 10;
    let $canvas = $("#canvas");
    let canvas = document.getElementById("canvas");
    let ctx = $canvas[0].getContext("2d");
    // number of rows and columns on our board
    let rows = canvas.height / squareSize;
    let cols = canvas.width / squareSize;

    // map for cells
    let cells = initGrid();
    $canvas.click((event) => {
        // set run to false so you can add cells by clicking while the board is running
        run = false;
        let row = Math.floor(event.offsetY / squareSize);
        let col = Math.floor(event.offsetX / squareSize);
        console.log(row);
        console.log(col);
        drawCell(row, col, !cells[[row, col]]);
    });

    // functions for incrementing the generation counter
    function setGeneration(newGen) {
        let generation = document.getElementById("generation");
        generation.innerHTML = newGen;
    }

    function incrementGeneration() {
        let generation = document.getElementById("generation");
        let curGen = parseInt(generation.innerHTML);
        curGen ++;
        setGeneration(curGen);
    }

    function resetGeneration() {
        setGeneration(0);
    }
    // function takes in data to send to the server and returns the settings
    // object to pass to jquery post to make a post request.
    function producePostParams(data) {
        let settings = {};
        // set data
        settings["data"] = data;
        // want a synchronous request
        settings["async"] = false;
        // post url
        settings["url"] = "/update";
        // set success function
        settings["success"] = (responseJson) => {
            responseJson = JSON.parse(responseJson);
            console.log("size of response: " + Object.keys(responseJson).length);
            let draw_time = new Date().getTime();
            for(const key of Object.keys(responseJson)) {
                // parse stringified key into array of ints
                let arr = JSON.parse(key);
                // fill in the cell
                // note that updating our cell map is handled by drawCell
                drawCell(parseInt(arr[0]), parseInt(arr[1]), responseJson[key]);
            }
            console.log("received and finished");
        };
        // we don't have to set the request type b/c we're calling this w/$.post
        return settings
    }

    // sets up initial grid object
    function initGrid() {
        let grid = {};
        // let grid = new Map();
        for(let r = 0; r < rows; r ++) {
            for(let c = 0; c < cols; c ++) {
                grid[[r, c]] = false;
            }
        }
        return grid;
    }
    // draws all cells as dead
    function drawDeadBoard() {
        // draw initial board where everything is dead
        for(let r = 0; r < rows; r ++) {
            for(let c = 0; c < cols; c ++) {
                drawCell(r, c, false);
            }
        }
    }
    // draws grid
    function drawGrid() {
        let height = canvas.height;
        let width = canvas.width;
        console.log(height);
        console.log(width);
        for(i = 0; i <= height; i += squareSize) {
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
        }
        for(i = 0; i <= width; i += squareSize) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
        }
        ctx.strokeStyle = "grey";
        ctx.stroke();
        drawDeadBoard();
    }

    /*
    Draws a cell at row, col. alive is a boolean, True means alive, False means dead
     */
    function drawCell(row, col, alive) {
        ctx.fillStyle = colors[alive];
        // adding 1 and subtracting 1 to keep the grid lines on the canvas
        ctx.fillRect(col * squareSize + 1, row * squareSize + 1, squareSize - 1, squareSize - 1);
        cells[[row, col]] = alive;
    }

    // converts r, g, b values to hex color string
    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255) {
            throw "invalid color";
        }
        return ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
    }

    // checks whether a cell at row, col is alive or not.
    function isAlive(row, col) {
        // start by calculating the center of the cell
        let centX = col * squareSize + squareSize / 2;
        let centY = row * squareSize + squareSize / 2;
        let color = ctx.getImageData(centX, centY, 1, 1).data;
        // get color of clicked cell as a string
        let colorString = "#" + ("000000" + rgbToHex(color[0], color[1], color[2])).slice(-6);
        // console.log(colorString);
        return colorString === "#00FF00";
    }

    // gets neighbors of row, col as an array of arrays
    function getNeighbors(row, col) {
        let arr = [];
        for(let i = -1; i <= 1; i ++) {
            for(let j = -1; j <= 1; j++) {
                arr.push([row + i, col + j]);
            }
        }
        return arr
    }

    // takes in object containing the cells->state and produces an object containing only the
    // mappings that the server needs to know about (the ones it might update). These are defined
    // as any live cell and any cell that's a neighbor of a live cell.
    function collectImportant(cells) {
        let important = {};
        for(let r = 0; r < rows; r ++) {
            for(let c = 0; c < cols; c ++){
                // iterate over possible neighbors
                for(const neighbor of getNeighbors(r, c)) {
                    // if the neighbor was alive, the cell is important so we add it.
                    if(neighbor in cells && cells[neighbor]) {
                        important[[r, c]] = cells[[r, c]];
                        break;
                    }
                }
            }
        }
        // now we add the bound coordinate to the map
        if(!([rows - 1, cols - 1] in important)) {
            important[[rows - 1, cols - 1]] = isAlive(rows, cols);
        }
        return important
    }

    function updateBoard() {
        let start_time = new Date().getTime();
        let m = collectImportant(cells);
        let str_m = JSON.stringify(m);
        console.log("size of posted map: " + Object.keys(m).length);
        $.post(producePostParams(str_m));
        // $.post("/update", str_m, (responseJson) => {
        //     responseJson = JSON.parse(responseJson);
        //     console.log("size of response: " + Object.keys(responseJson).length);
        //     let draw_time = new Date().getTime();
        //     for(const key of Object.keys(responseJson)) {
        //         // parse stringified key into array of ints
        //         let arr = JSON.parse(key);
        //         // fill in the cell
        //         // note that updating our cell map is handled by drawCell
        //         drawCell(parseInt(arr[0]), parseInt(arr[1]), responseJson[key]);
        //     }
        //     console.log("received and finished");
        //     console.log("total time to draw: " + (new Date().getTime() - draw_time).toString());
        //     console.log("total time to post: " + (new Date().getTime() - start_time).toString());
        // });
    }
    function runLoop() {
        if(!run) {
            resetGeneration();
            return
        }
        updateBoard();
        incrementGeneration();
        setTimeout(runLoop, 0);
    }
    // draw initial grid
    drawGrid();
});
