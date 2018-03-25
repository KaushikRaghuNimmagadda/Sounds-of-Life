$(document).ready(() => {
    // map for colors
    let colors = {};
    colors[true] = "#00FF00";
    colors[false] = "#000000";
    const squareSize = 10;
    let $canvas = $("#canvas");
    let canvas = document.getElementById("canvas");
    let ctx = $canvas[0].getContext("2d");
    $canvas.click((event) => {
        let row = Math.floor(event.offsetY / squareSize);
        let col = Math.floor(event.offsetX / squareSize);
        console.log(row);
        console.log(col);
        drawCell(row, col, Math.random() > 0.5);
    });
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
    }

    drawGrid();
});
