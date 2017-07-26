

$(function () {
    
    // set the konva stage in div with id 'canvas'
    var width =500;
    var height = 500;
    var stage = new Konva.Stage({
        container: 'canvas',
        width: width,
        height: height
    });

    var layer = new Konva.Layer();
    stage.add(layer);

    // function that adds a line to canvas
    var drawLine = function (x1, y1, x2, y2) {
        console.log("Drawing Line:", x1, y1, x2, y2);
        var line = new Konva.Line({
            points: [x1+width/2, -y1+height/2, x2+width/2, -y2+height/2],
            stroke: 'red',
            strokeWidth: 4,
            fill:'#00ffcd',
             lineCap: 'round',
             lineJoin: 'round'
          
    
        });
        layer.add(line);
        layer.draw();
    };
    //function to add meshes
     var drawMesh = function (x1, y1, x2, y2) {
        console.log("Drawing Line:", x1, y1, x2, y2);
        var line = new Konva.Line({
            points: [x1+width/2, -y1+height/2, x2+width/2, -y2+height/2],
            stroke: 'blue',
            strokeWidth: 1,
            fill:'#00ffcd'
          
    
        });
        layer.add(line);
        layer.draw();
    };

    // global coordinate container
    var coordinates = [];
    var xvalues=[];
    var yvalues=[];

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
        xvalues.push(x);
        yvalues.push(y);

        // if there is some kind of invalid input, warn the user and return
        if (isNaN(x) || isNaN(y)) {
            console.warn("Coordinate is invalid.");
            return;
        }

        // empty the input box so that user can directly begin to write new coordinate
        $("#coordinate").val("");

        // if user enters the first coordinate again, close the loop and return
        if (coordinates.length >= 3 && x === coordinates[0][0] && y === coordinates[0][1]) {
            $("#coordinates").append("Loop closed.");
            var lastPoint = coordinates[coordinates.length - 1];
            drawLine(lastPoint[0], lastPoint[1], x, y);
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
    
    $('#mesh').click(function(){
      var segment=$("#segment").val();
      $("#segment").val("");
        
      mesafe=parseInt(segment);
        
      var xMax=Math.max.apply(null,xvalues);
      var xMin=Math.min.apply(null,xvalues);
      var yMax=Math.max.apply(null,yvalues);
      var yMin=Math.min.apply(null,yvalues);
      var deltaX=Math.abs(xMax-xMin)/mesafe;
      var deltaY=Math.abs(yMax-yMin)/mesafe;
        
        if(coordinates.length===3){
            
            console.log('under construction')
        }
        
        if(coordinates.length ===4){
            x1=xMin;
            y1=yMin;
            for(i=1;i<mesafe+1;i++){
                for (j=1;j<mesafe;j++){
                
                drawMesh(x1,y1+deltaY,x1+deltaX,y1+deltaY);
                y1+=deltaY;
                }
                x1+=deltaX;
                y1=yMin;
              
            }
            
            //===============================
            x1=xMin;
                for(i=1;i<mesafe+1;i++){
                for (j=1;j<mesafe;j++){
                
                drawMesh(x1+deltaX,y1,x1+deltaX,y1+deltaY);
                x1+=deltaX;
                }
                y1+=deltaY;
                x1=xMin;
              
            }    
        }    
    });
 
    
  // I could not find a method to remove the canvas content and keep drawing again??
  // anyway I tried it clears the content but does not draw unless the page is refreshed. 
            $("#delete").click(function(){
                coordinates=[];
                $('#coordinates').html('');
 
                });
    
});



