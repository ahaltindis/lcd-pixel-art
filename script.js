var canvas = document.getElementById("pixelCanvas");

var context = canvas.getContext("2d");

var displayWidth = 84;
var displayHeight = 48;

var pixelSize = 13;

canvas.width = pixelSize*displayWidth;
canvas.height = pixelSize*displayHeight;

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

canvas.addEventListener("click", drawOnClick, false);

var count_x = 0;
var count_y = 0;

function drawOnClick(e) {
  if ( count_x >= displayWidth ) {
    count_x = 0;
    count_y++;
  }
  context.fillRect(pixelSize*count_x+0.5, pixelSize*count_y+0.5, pixelSize, pixelSize);
  count_x++;
}
