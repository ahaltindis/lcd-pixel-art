var canvas = document.getElementById("pixelCanvas"),
  context = canvas.getContext("2d");

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

//context.fillRect(15, 15, 15, 15);
//context.fillRect(45, 15, 15, 15);

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
