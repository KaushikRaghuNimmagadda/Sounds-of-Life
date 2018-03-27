$(document).ready(() => {
    // map for colors
    let colors = {};
    colors[true] = "#00FF00";
    colors[false] = "#000000";
    let $button = $("#button");
    $button.click(updateBoard);
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
        let row = Math.floor(event.offsetY / squareSize);
        let col = Math.floor(event.offsetX / squareSize);
        console.log(row);
        console.log(col);
        drawCell(row, col, true);
    });
    // sets up initial grid object
    function initGrid() {
        let grid = {};
        for(let r = 0; r < rows; r ++) {
            for(let c = 0; c < cols; c ++) {
                grid[[r, c]] = false;
            }
        }
        return grid;
    }
    // draws initial grid
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
    }

    /*
    Draws a cell at row, col. alive is a boolean, True means alive, False means dead
     */
    function drawCell(row, col, alive) {
        ctx.fillStyle = colors[alive];
        // adding 1 and subtracting 1 to keep the grid lines on the canvas
        ctx.fillRect(col * squareSize + 1, row * squareSize + 1, squareSize - 1, squareSize - 1);
        // update cell states object
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

    // builds map of current cell states to send to backend
    function buildMap() {
        // let m = new Map();
        let m = {};
        for(let row = 0; row < rows; row ++) {
            for(let col = 0; col < cols; col ++) {
                m[[row, col]] = isAlive(row, col);
            }
        }
        return m;
    }

    function updateBoard() {
        // so buildMap produces the correct map but JSON.stringify
        // just makes an empty one? Turns out maps can't be serialized
        // to JSON.
        let start_time = new Date().getTime();
        // let m = buildMap();
        let m = cells;
        let map_time = new Date().getTime();
        console.log("time to build map: " + (map_time - start_time).toString());
        // console.log(Object.keys(m).length);
        $.post("/update", m, (responseJson) => {
            responseJson = JSON.parse(responseJson);
            console.log(responseJson);
            console.log(Object.keys(responseJson).length);
            let draw_time = new Date().getTime();
            for(const key of Object.keys(responseJson)) {
                // parse stringified key into array of ints
                let arr = JSON.parse(key);
                // fill in the cell
                // note that updating our cell map is handled by drawCell
                drawCell(parseInt(arr[0]), parseInt(arr[1]), responseJson[key]);
            }
            console.log("received and finished");
            console.log("total time to draw: " + (new Date().getTime() - draw_time).toString());
            console.log("total time to post: " + (new Date().getTime() - start_time).toString());
        });
    }
    drawGrid();
});
