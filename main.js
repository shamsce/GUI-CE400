 var cx = document.querySelector("plot").getContext("2d");
    cx.beginPath();
    cx.moveTo(x-one, y-one);
    cx.lineTo(x-two, y-two);
    cx.stroke();
