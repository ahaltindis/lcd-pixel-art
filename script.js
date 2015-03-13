var canvas = document.getElementById("pixelCanvas");

var context = canvas.getContext("2d");

var displayWidth = 84;
var displayHeight = 48;
var pixelSize = 10;
var fillColor = "black";

var pixels = new Array(displayWidth);
for ( var p_row = 0; p_row < displayWidth; p_row++ ) {
  pixels[p_row] = new Array(displayHeight);
  for ( var p_col = 0; p_col < displayHeight; p_col++ ) {
    pixels[p_row][p_col] = 0;
  }
}

canvas.width = pixelSize*displayWidth;
canvas.height = pixelSize*displayHeight;

canvas.addEventListener("click", canvasOnClick, false);

!function drawGrid() {
  for ( var x = 0.5; x < canvas.width; x += pixelSize) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }

  for ( var y = 0.5; y < canvas.height; y += pixelSize) {
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
  }

  context.strokeStyle = "#ddd";
  context.stroke();

  context.beginPath();
  for ( var x = 0.5; x < canvas.width; x += pixelSize*6) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }

  for ( var y = 0.5; y < canvas.height; y += pixelSize*8) {
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
  }

  context.strokeStyle = "#999";
  context.stroke();

}();

function Pixel(x, y) {
  this.x = x;
  this.y = y;
}

function togglePixel(pixel) {
  if ( pixels[pixel.x][pixel.y] ) {
    clearPixel(pixel);
  }
  else {
    fillPixel(pixel);
  }
}

function fillPixel(pixel) {
  if ( ! pixels[pixel.x][pixel.y] ) {
    context.fillStyle = fillColor;
    context.fillRect(pixelSize*pixel.x+1, pixelSize*pixel.y+1, pixelSize-1, pixelSize-1);
    pixels[pixel.x][pixel.y] = 1;
  }
}

function clearPixel(pixel) {
  if ( pixels[pixel.x][pixel.y] ) {
    context.fillStyle = "#ddd";
    //context.fillRect(pixelSize*pixel.x+1.5, pixelSize*pixel.y+1.5, pixelSize-1, pixelSize-1);
    context.clearRect(pixelSize*pixel.x+1, pixelSize*pixel.y+1, pixelSize-1, pixelSize-1);
    pixels[pixel.x][pixel.y] = 0;
  }
}


function canvasOnClick(e) {
  var pixel = getPixelOnCursor(e);
  
  //fillPixel(pixel);
  togglePixel(pixel);
}

function getPixelOnCursor(e) {
  var cursor_x, cursor_y;
  var x, y;

  if ( e.pageX != undefined && e.pageY != undefined ) {
    cursor_x = e.pageX;
    cursor_y = e.pageY;
  }
  else {
    cursor_x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    cursor_y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  cursor_x -= canvas.offsetLeft;
  cursor_y -= canvas.offsetTop;

  x = Math.floor(cursor_x / pixelSize);
  y = Math.floor(cursor_y / pixelSize);

  //alert("(" + x + ", " + y + ")");

  var pixel = new Pixel(x, y);

  return pixel;
}
