function myFunction() {

var x1 = parseFloat(document.getElementById('x1').value);
var y1 = parseFloat(document.getElementById('y1').value);

var x2 = parseFloat(document.getElementById('x2').value);
var y2 = parseFloat(document.getElementById('y2').value);

var c = document.getElementById("plot");
var ctx = c.getContext("2d");
   ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.stroke();
}

