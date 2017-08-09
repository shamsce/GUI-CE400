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
    var virtualPolygon = [];
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
            polygon[count] = coordinates;
            coordinates = [];
            count++;
            console.log(polygon,count,virtualPolygon);
            return;
        }

        // add the newly entered point to global coordinate container
        coordinates.push([x, y]);
       
        //add the new points to create a virtual polygon consists of only the sides
        if (!isItemInArray(virtualPolygon, [x, y])) {
            virtualPolygon.push([x, y]);
            
        }

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
    /*
    // temporarily draw a polygon
    coordinates.push([-120, -130]);
    coordinates.push([140, -190]);
    coordinates.push([130, 140]);
    coordinates.push([0, 80]);
    coordinates.push([-130, 150]);
    drawLine(-120, -130, 140, -190);
    drawLine(140, -190, 130, 140);
    drawLine(130, 140, 0, 80);
    drawLine(0, 80, -130, 150);
    drawLine(-130, 150, -120, -130);
    */

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //meshing is here: 
    var mesh = [];
    $('#mesh').click(function () {
        var delta = parseFloat($('#delta').val());
        console.log('Will try to mesh with delta = ', delta);

        for (var x = -width / 2; x <= width / 2; x += delta) {
            for (var y = -height / 2; y <= height / 2; y += delta) {
                if (inside([x, y], virtualPolygon)) {
                    mesh.push([x, y]);
                }
            }
        }

        mesh.forEach(function (center) {
            drawSquare(center[0], center[1], delta);
        });

        meshLayer.draw();
    });
 
    
    // I could not find a method to remove the canvas content and keep drawing again??
    // anyway I tried it clears the content but does not draw unless the page is refreshed. 
    $("#deleteAll").click(function(){
        coordinates.length = 0;
        mesh.length = 0;

        $('#coordinates').html('');
        polygonLayer.clear();
        meshLayer.clear();

    });

    $("#deleteMesh").click(function(){
        mesh.length = 0;
        meshLayer.clear();

    });

});



