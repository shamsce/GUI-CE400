// is point inside line segment
function isPointInsideSegment(x1, y1, x2, y2, xp, yp) {
    var e1x = x2 - x1;
    var e1y = y2 - y1;
    var recArea = (e1x * e1x) + (e1y * e1y);
    var e2x = xp - x1;
    var e2y = yp - y1;
    var val = (e1x * e2x) + (e1y * e2y);
    return val > 0 && val < recArea;
}


//Item not in object function
function isItemNotInObject(object, idName, item) {
    var contain = true;
    Object.keys(object).forEach(function (idName) {
            var holder = object[idName];
            /*console.log(holder, item);*/
            if (holder[0] == item[0] && holder[1] == item[1]) {
            contain = false;   // Found it
            }
        
    });

    return contain;     // Not found
}


//is point inside a polygon
function insideleft(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
        if ( x === xi && y === yi) {
            inside = true;
        }
        if ( x === xj && y === yj) {
            inside = true;
        }
    }

    return inside;
};

function insideright(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi >= y) != (yj >= y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
        if ( x === xi && y === yi) {
            inside = true;
        }
        if ( x === xj && y === yj) {
            inside = true;
        }
    }

    return inside;
};

function insideup(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x <= (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
        if ( x === xi && y === yi) {
            inside = true;
        }
        if ( x === xj && y === yj) {
            inside = true;
        }
    }

    return inside;
};

function insidedown(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi >= y) != (yj >= y))
            && (x <= (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
        if ( x === xi && y === yi) {
            inside = true;
        }
        if ( x === xj && y === yj) {
            inside = true;
        }
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

    var bcLayer = new Konva.Layer();
    stage.add(bcLayer);

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
            strokeWidth: 1,
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

    // function that draws a circle on the given coordinate
    var drawCircle = function (x, y, radius) {
        console.log("Drawing circle:", x, y, radius);
        var circle = new Konva.Circle({
            x: convertX(x),
            y: convertY(y),
            radius: radius,
            fill: 'green',
            stroke: 'green',
            strokeWidth: 1
        });
        bcLayer.add(circle);
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
    var delta;
    var mesh = {};
    var squareId = 1;
    $('#mesh').click(function () {
        delta = parseFloat($('#delta').val());
        if (isNaN(delta)) {
            alert("Mesh size is empty!");
            return;
        }
        console.log('Will try to mesh with delta = ', delta);

        
        for (var y = -height / 2; y <= height / 2; y += delta) {
            for (var x = -width / 2; x <= width / 2; x += delta) {
                for (var i = 0; i < polygon.length; i += 1) {
                    if (insideleft( [x, y], polygon[i]) || insideright( [x, y], polygon[i]) || insideup( [x, y], polygon[i]) || insidedown( [x, y], polygon[i])) {
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
    var boundaryConditions = {};
    var bcId = 1;
    var imgBoundDraw = [];
    $('#addBc').click(function () {
        var bcX1 = parseFloat($('#bcX1').val());
        var bcY1 = parseFloat($('#bcY1').val());
        var bcX2 = parseFloat($('#bcX2').val());
        var bcY2 = parseFloat($('#bcY2').val());

    //Checking square intersects the given boundary condition line segment

        var A = (bcY2 - bcY1);
        var B = (bcX1 - bcX2);
        var N = (bcY2 - (((bcY2 - bcY1)* bcX2) / (bcX2 - bcX1)));
        var C = ((bcX2 - bcX1)* N);

    //if BC line is perpendicular to x axis

        if (isNaN(C)) {

            Object.keys(mesh).forEach(function (squareId) {
                var square = mesh[squareId];
                var xCenter = square[0];
                var yCenter = square[1];

               

                var corner1x = (xCenter + (delta/2));
                var corner1y = (yCenter + (delta/2));
                var corner2x = (xCenter - (delta/2));
                var corner2y = (yCenter + (delta/2));
                var corner3x = (xCenter - (delta/2));
                var corner3y = (yCenter - (delta/2));
                var corner4x = (xCenter + (delta/2));
                var corner4y = (yCenter - (delta/2));

            

                var d1 = corner1x - bcX1;
                var d2 = corner2x - bcX1;
                var d3 = corner3x - bcX1;
                var d4 = corner4x - bcX1;

                

                if( Math.sign(d1) !== Math.sign(d2) || Math.sign(d1) !== Math.sign(d3) || Math.sign(d1) !== Math.sign(d4) ) {
                    var scaledPositionCorner1 = (Math.abs(corner1y) - Math.abs(bcY1)) / (Math.abs(bcY2) - Math.abs(bcY1));
                    var scaledPositionCorner2 = (Math.abs(corner2y) - Math.abs(bcY1)) / (Math.abs(bcY2) - Math.abs(bcY1));
                    var scaledPositionCorner3 = (Math.abs(corner3y) - Math.abs(bcY1)) / (Math.abs(bcY2) - Math.abs(bcY1));
                    var scaledPositionCorner4 = (Math.abs(corner4y) - Math.abs(bcY1)) / (Math.abs(bcY2) - Math.abs(bcY1));

                    if( scaledPositionCorner1 <= 1.0 && scaledPositionCorner1 >= 0.0 ||
                        scaledPositionCorner2 <= 1.0 && scaledPositionCorner2 >= 0.0 ||
                        scaledPositionCorner3 <= 1.0 && scaledPositionCorner3 >= 0.0 ||
                        scaledPositionCorner4 <= 1.0 && scaledPositionCorner4 >= 0.0 ) {
                            boundaryConditions[bcId] = {type: 'fixed', squareId: squareId};
                            bcId += 1;

                            var imgsquareup = [square[0] + delta, square[1]];
                            var imgsquaredown = [square[0] - delta, square[1]];

                            if( isItemNotInObject(mesh, squareId, imgsquareup)) {
                                imgBoundDraw.push(imgsquareup);
                            }

                            else if ( isItemNotInObject(mesh, squareId, imgsquaredown)) {
                                imgBoundDraw.push(imgsquaredown);
                            }

                            else {
                                imgBoundDraw.push(square);
                            }
                                    }
                                }
                    
            });

            console.log(boundaryConditions);

            bcLayer.children.length = 0;
            bcLayer.clear();


            
        }

        //if BC line is not perpendicular to x axis

        else {

            Object.keys(mesh).forEach(function (squareId) {
                var square = mesh[squareId];
                var xCenter = square[0];
                var yCenter = square[1];

                

                var corner1x = (xCenter + (delta/2));
                var corner1y = (yCenter + (delta/2));
                var corner2x = (xCenter - (delta/2));
                var corner2y = (yCenter + (delta/2));
                var corner3x = (xCenter - (delta/2));
                var corner3y = (yCenter - (delta/2));
                var corner4x = (xCenter + (delta/2));
                var corner4y = (yCenter - (delta/2));

                

                var d1 = (((A*corner1x) + (B*corner1y) + C) / Math.sqrt ((A*A)+(B*B)));
                var d2 = (((A*corner2x) + (B*corner2y) + C) / Math.sqrt ((A*A)+(B*B)));
                var d3 = (((A*corner3x) + (B*corner3y) + C) / Math.sqrt ((A*A)+(B*B)));
                var d4 = (((A*corner4x) + (B*corner4y) + C) / Math.sqrt ((A*A)+(B*B)));

                

                if( Math.sign(d1) !== Math.sign(d2) || Math.sign(d1) !== Math.sign(d3) || Math.sign(d1) !== Math.sign(d4) ) {
                    if( isPointInsideSegment(bcX1,bcY1,bcX2,bcY2,corner1x,corner1y) ||
                        isPointInsideSegment(bcX1,bcY1,bcX2,bcY2,corner2x,corner2y) ||
                        isPointInsideSegment(bcX1,bcY1,bcX2,bcY2,corner3x,corner3y) ||
                        isPointInsideSegment(bcX1,bcY1,bcX2,bcY2,corner4x,corner4y)) {
                            boundaryConditions[bcId] = {type: 'fixed', squareId: squareId};
                            bcId += 1;
                            var imgsquareup = [square[0], square[1] + delta];
                            var imgsquaredown = [square[0], square[1] - delta];

                            /*console.log("squarecoor:", square, "up:", imgsquareup, "down:", imgsquaredown);*/

                            if( isItemNotInObject(mesh, squareId, imgsquareup)) {
                                imgBoundDraw.push(imgsquareup);
                            }

                            else if ( isItemNotInObject(mesh, squareId, imgsquaredown)) {
                                imgBoundDraw.push(imgsquaredown);
                            }

                            else {
                                imgBoundDraw.push(square);
                            }
                                }
                            }
                
        });

        console.log(boundaryConditions);

        bcLayer.children.length = 0;
        bcLayer.clear();
        
           
        }

        for (i = 0; i < imgBoundDraw.length; i++) {
            x = imgBoundDraw[i][0];
            y = imgBoundDraw[i][1]
            drawCircle(x, y, delta / 4);

        }

        bcLayer.draw();
    });
     
    $("#deleteAll").click(function(){
        coordinates = [];
        polygon = [];
        polygonLayer.children.length = 0;
        polygonLayer.clear();

        squareId = 1;
        mesh = {};
        meshLayer.children.length = 0;
        meshLayer.clear();

        bcId = 1;
        boundaryConditions = {};
        bcLayer.children.length = 0;
        bcLayer.clear();

        $('#coordinates').html('');
    });

    $("#deleteMesh").click(function(){
        
        squareId = 1;
        mesh = {};
        meshLayer.children.length = 0;
        meshLayer.clear();
    });

     $("#deleteBc").click(function(){
        
        bcId = 1;
        boundaryConditions = {};
        bcLayer.children.length = 0;
        bcLayer.clear();

    });
});



