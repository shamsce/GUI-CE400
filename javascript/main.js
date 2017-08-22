// Projection of point on line

function getSpPoint(aX,aY,bX,bY,cX,cY){
    var x1=aX, y1=aY, x2=bX, y2=bY, x3=cX, y3=cY;
    var px = x2-x1, py = y2-y1, dAB = px*px + py*py;
    var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
    var x = x1 + u * px, y = y1 + u * py;

    	if (0 <= ( (Math.abs(x-x1)) / (Math.abs(x2-x1))) <= 1) {
    		return true;
    	}

    return false;
}

//Item in array function
function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

$(function () {
    
    // set the konva stage in div with id 'canvas'
    var width = 500;
    var height = 500;
    var stage = new Konva.Stage({
        container: 'canvas',
        width: width,
        height: height
    });

    var polygonLayer = new Konva.Layer();
    stage.add(polygonLayer);

    var meshLayer = new Konva.Layer();
    stage.add(meshLayer);

    // function that converts logical coordinate to physical
    var convertX = function (x) {
        return x + width / 2;
    };
    var convertY = function (y) {
        return -y + height / 2;
    };

    // function that adds a line to canvas
    var drawLine = function (x1, y1, x2, y2) {
        console.log("Drawing Line:", x1, y1, x2, y2);
        var line = new Konva.Line({
            points: [convertX(x1), convertY(y1), convertX(x2), convertY(y2)],
            stroke: 'red',
            strokeWidth: 4,
            fill:'#00ffcd',
            lineCap: 'round',
            lineJoin: 'round'
        });
        polygonLayer.add(line);
        polygonLayer.draw();
    };

    // function that draws a square on the given coordinate
    var drawSquare = function (x, y, sideLength) {
        console.log("Drawing square:", x, y, sideLength);
        /*
        var point = new Konva.Circle({
            x: convertX(x),
            y: convertY(y),
            radius: 1,
            fill: 'green',
            stroke: 'green',
            strokeWidth: 4
        });
        meshLayer.add(point);
        */
        var rect = new Konva.Rect({
            x: convertX(x - sideLength / 2),
            y: convertY(y + sideLength / 2),
            width: sideLength,
            height: sideLength,
            stroke: 'blue',
            strokeWidth: 0.5
        });
        meshLayer.add(rect);
    };

    // global coordinate container
    var coordinates = [];
    var polygon = [];
    var count = 0;
    // handle submits on form with id 'drawForm'
    $("#drawForm").submit(function (event) {
        
        // prevent form submission and page refresh
        event.preventDefault();

        // get the text value of the input box with id 'coordinate'
        var coordinate = $("#coordinate").val();
        
        // parse the text using commas and convert the partials to numbers
        coordinate = coordinate.split(",");
        var x = parseFloat(coordinate[0]);
        var y = parseFloat(coordinate[1]);

        // if there is some kind of invalid input, warn the user and return
        if (isNaN(x) || isNaN(y)) {
            console.warn("Coordinate is invalid.");
            return;
        }

        // empty the input box so that user can directly begin to write new coordinate
        $("#coordinate").val("");

        // if user enters the first coordinate again, assign coordinates to polygon, empty the coordinates
        //close the loop and return
        if (coordinates.length >= 3 && x === coordinates[0][0] && y === coordinates[0][1]) {
            $("#coordinates").append("Loop closed.");
            var lastPoint = coordinates[coordinates.length - 1];
            drawLine(lastPoint[0], lastPoint[1], x, y);
            polygon.push(coordinates);
            $("#polygon[i]").append("coordinates")
            coordinates = [];
            return;
        }

        // add the newly entered point to global coordinate container
        coordinates.push([x, y]);
       
    
        // also display the newly added point
        $("#coordinates").append("(" + x + ", " + y + "), ");

        // if there are more less than 2 points, return
        if (coordinates.length < 2) {
            return;
        }

        // draw a line in between last entered point and newly entered point
        var lastPoint = coordinates[coordinates.length - 2];
        var newPoint = coordinates[coordinates.length - 1];
        drawLine(lastPoint[0], lastPoint[1], newPoint[0], newPoint[1]);
    });

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //meshing is here: 
    var mesh = {};
    $('#mesh').click(function () {
        var delta = parseFloat($('#delta').val());
        if (isNaN(delta)) {
        	alert("Mesh size is empty!");
        	return;
        }
        console.log('Will try to mesh with delta = ', delta);

        var squareId = 1;
        for (var x = -width / 2; x <= width / 2; x += delta) {
            for (var y = -height / 2; y <= height / 2; y += delta) {
                for (var i = 0; i < polygon.length; i += 1) {
                	if (inside([x, y], polygon[i])) {
                    	mesh[squareId] = [x, y];
                    	squareId += 1;
                    }
                }
            }
        }

        Object.keys(mesh).forEach(function (squareId) {
        	var square = mesh[squareId];
        	var x = square[0];
        	var y = square[1];
            drawSquare(x, y, delta);
        });

        meshLayer.draw();
        console.log(mesh);
    });


  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 	//Adding a Boundary Condition
 	var BC= {};
 	$('#addBc').click(function () {
 		var bcX1 = parseFloat($('#bcX1').val());
	 	var bcY1 = parseFloat($('#bcY1').val());
	 	var bcX2 = parseFloat($('#bcX2').val());
	 	var bcY2 = parseFloat($('#bcY2').val());

	//Checking square intersects the given boundary condition line

		var A = (bcY2 - bcY1);
	    var B = (bcX1 - bcX2);
	    var N = (bcY2 - (((bcY2 - bcY1)* bcX2) / (bcX2 - bcX1)));
	    var C = ((bcX2 - bcX1)* N);

	 	Object.keys(mesh).forEach(function (squareId) {
	        	var square = mesh[squareId];
	        	var corner1x = (square[0] + (delta/2));
	        	var corner1y = (square[1] + (delta/2));
	        	var corner2x = (square[0] - (delta/2));
	        	var corner2y = (square[1] + (delta/2));
	        	var corner3x = (square[0] - (delta/2));
	        	var corner3y = (square[1] - (delta/2));
	        	var corner4x = (square[0] + (delta/2));
	        	var corner4y = (square[1] - (delta/2));

	        	var d1 = (((A*corner1x) + (B*corner1y) + C) / Math.sqrt ((A*A)+(B*B)));
				var d2 = (((A*corner2x) + (B*corner2y) + C) / Math.sqrt ((A*A)+(B*B)));
				var d3 = (((A*corner3x) + (B*corner3y) + C) / Math.sqrt ((A*A)+(B*B)));
				var d4 = (((A*corner4x) + (B*corner4y) + C) / Math.sqrt ((A*A)+(B*B)));

				if( Math.sign(d1) !== Math.sign(d2) || Math.sign(d1) !== Math.sign(d3) || Math.sign(d1) !== Math.sign(d4) ) {

					var elementId = 1;

					if( getSpPoint(bcX1,bcY1,bcX2,bcY2,corner1x,corner1y) || getSpPoint(bcX1,bcY1,bcX2,bcY2,corner2x,corner2y) || getSpPoint(bcX1,bcY1,bcX2,bcY2,corner3x,corner3y) || getSpPoint(bcX1,bcY1,bcX2,bcY2,corner4x,corner4y)){
						 BC[elementId]= {type: 'fixed', id: squareId};
						 elementId+=1;
						return;
					}
				}

				
		});

		console.log(BC);

	});

    
    // I could not find a method to remove the canvas content and keep drawing again??
    // anyway I tried it clears the content but does not draw unless the page is refreshed. 
    $("#deleteAll").click(function(){
        coordinates = [];
        polygon = [];
        mesh = {};

        polygonLayer.children.length = 0;
        meshLayer.children.length = 0;

        polygonLayer.clear();
        meshLayer.clear();

        $('#coordinates').html('');
    });

});



