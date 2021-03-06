/* script.js
 * =========
 * Javascript codes of lcd-pixel-art project.
 * 
 */

//-- Dom elements
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var canvasContainer = document.getElementById("canvas-container");
var btnClean = document.getElementById("button-clean");
var btnReverse = document.getElementById("button-reverse");
var btnZoomIn = document.getElementById("button-zoom-in");
var btnZoomOut = document.getElementById("button-zoom-out");
var penModes = document.penModes.penMode
var output = document.getElementById("output");
var btnGenerate = document.getElementById("button-generate");

//-- Global variables
// Holds all pixel status(1 or 0) as a matrix. 
// [DisplayWidth][DisplayHeight]
var pixels;

// Current penMode as string ("toggle", "fill", "clear")
var penMode;

//-- State variables
var drawing = false;   // For continuous drawing
var prevPixel;         // To prevent fill-clear effect while mouse moving on same pixel in toggle mode. 

//-- Predefined variables
var displayWidth = 84;
var displayHeight = 48;
var pixelSize = 10;
var fillColor = "#000";

init();
initEventListeners();

function init() {
  //initialize pixels matrix
  pixels = new Array(displayWidth);
  for ( var p_row = 0; p_row < displayWidth; p_row++ ) {
    pixels[p_row] = new Array(displayHeight);
    for ( var p_col = 0; p_col < displayHeight; p_col++ ) {
      pixels[p_row][p_col] = 0;
    }
  }

  //Set canvas size
  canvas.width = pixelSize*displayWidth;
  canvas.height = pixelSize*displayHeight;

  //Draw grids
  drawGrid();
}

function initEventListeners() {
  canvas.addEventListener("mousedown", function(e) {
    var pixel = getPixelOnCursor(e);
    onClickPixel(pixel);
    drawing = true;
    prevPixel = pixel;
  });

  canvas.addEventListener("mouseup", function(e) {
    drawing = false;
    prevPixel = null;
  });

  canvas.addEventListener("mousemove", function(e) {
    if ( drawing ) {
      var pixel = getPixelOnCursor(e);
      if ( !(pixel.x == prevPixel.x && pixel.y == prevPixel.y) ) {
        onClickPixel(pixel);
        prevPixel = pixel;
      }
    }
  });

  btnClean.onclick = function(e) {
    e.preventDefault;
    init();
  }

  btnReverse.onclick = function(e) {
    e.preventDefault;
    reverseFill();
  }

  btnZoomIn.onclick = function(e) {
    e.preventDefault;
    if ( pixelSize < 30 ) {
      pixelSize++;
      refillGrid();
    }
  }

  btnZoomOut.onclick = function(e) {
    e.preventDefault;
    if ( pixelSize > 1 ) {
      pixelSize--;
      refillGrid();
    }
    else {
      alert("Grid size cannot be smaller.");
    }
  }

  for ( var i = 0; i < penModes.length; i++ ) {
    if ( penModes[i].checked ) {
      penMode = penModes[i].value;
    }
    penModes[i].onchange = function() {
      penMode = this.value;
    }
  }

  btnGenerate.onclick = function(e) {
    e.preventDefault;
    generateOutput();
  }
}

function generateOutput() {
  var outputText = "";
  outputText += "// Hexadecimal output for 84x48 lcd.\n";
  outputText += "// Created with lcd-pixel-art:\n";
  outputText += "// http://ahaltindis.github.io/lcd-pixel-art\n\n\n";

  var allstr = "";
  var cellstr = "";
  var colstr = "";
  var pixstr = ""
  allstr = "[\n";
  for ( var cellRow = 0; cellRow < 6; cellRow++ ) {
    allstr += "//--- row " + cellRow + "\n";
    cellstr = "[\n";
    for ( var cellCol = 0; cellCol < 14; cellCol++) {
      colstr = "[";
      for ( var rowNumber = 0; rowNumber < 6; rowNumber++) {
        for ( var colNumber = 0; colNumber < 8; colNumber++ ) {
          pixstr +=pixels[(cellCol*6)+rowNumber][(cellRow*8)+colNumber];
        }
        colstr += bin2hex(pixstr);
        pixstr = "";
        if ( rowNumber != 5 )
          colstr += ", ";
      }
      colstr += "]";
      if ( cellCol != 13 )
        colstr += ",";

      colstr += "\t// col " + cellCol + "\n";
      cellstr += colstr;
    }
    cellstr += "]";
    if ( cellRow != 5 )
      cellstr += ",\n";
    allstr += cellstr;
  }
  allstr += "];";

  outputText += allstr;

  output.value = outputText;
}

function bin2hex(bin) {
  var hexOutput = "";
  var hexVal = "";

  hexOutput += "0x";

  hexVal += parseInt(bin, 2).toString(16).toUpperCase();

  if ( hexVal.length === 1 ) 
    hexOutput += "0";

  hexOutput += hexVal

  return hexOutput;
}

function refillGrid() {
  canvas.width = pixelSize*displayWidth;
  canvas.height = pixelSize*displayHeight;

  for ( var p_row = 0; p_row < displayWidth; p_row++ ) {
    for ( var p_col = 0; p_col < displayHeight; p_col++ ) {
      if ( pixels[p_row][p_col] ) {
        context.fillStyle = fillColor;
        context.fillRect(pixelSize*p_row+1, pixelSize*p_col+1, pixelSize-1, pixelSize-1);
      }
    }
  }

  drawGrid();
}

function reverseFill() {
  canvas.width = pixelSize*displayWidth;
  canvas.height = pixelSize*displayHeight;

  for ( var p_row = 0; p_row < displayWidth; p_row++ ) {
    for ( var p_col = 0; p_col < displayHeight; p_col++ ) {
      if ( pixels[p_row][p_col] ) {
        clearPixel(new Pixel(p_row, p_col));
      }
      else {
        fillPixel(new Pixel(p_row, p_col));
      }
    }
  }

  drawGrid();
}

function drawGrid() {
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
}

function Pixel(x, y) {
  this.x = x;
  this.y = y;
}

function onClickPixel(pixel) {
  if ( penMode === "toggle") {
    togglePixel(pixel);
  }
  else if ( penMode === "fill" ) {
    fillPixel(pixel);
  }
  else if ( penMode === "clear" ) {
    clearPixel(pixel);
  }
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
    context.clearRect(pixelSize*pixel.x+1, pixelSize*pixel.y+1, pixelSize-1, pixelSize-1);
    pixels[pixel.x][pixel.y] = 0;
  }
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

  cursor_x += canvasContainer.scrollLeft;
  cursor_y += canvasContainer.scrollTop;

  x = Math.floor(cursor_x / pixelSize);
  y = Math.floor(cursor_y / pixelSize);

  var pixel = new Pixel(x, y);

  return pixel;
}
