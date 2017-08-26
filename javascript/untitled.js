


Object.keys(boundaryConditions).forEach(function (bcId) {
            
            var square = mesh[boundaryConditions[bcId].squareId];
            var imgsquareup = [square[0] + delta, square[1]];
            var imgsquaredown = [square[0] - delta, square[1]];

            if( isItemNotinObject(mesh, squareId, imgsquareup)) {
            	drawCircle(imgsquareup[0], imgsquareup[1], delta / 4);
            }

            else if ( isItemNotinObject(mesh, squareId, imgsquaredown)) {
            	drawCircle(imgsquaredown[0], imgsquaredown[1], delta / 4);
            }

            else {
            	drawCircle(square[0], square[1], delta / 4)
            }

 			bcLayer.draw();
        });