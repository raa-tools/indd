#target InDesign

var INCREMENT = 0.5;

var getPointSize = function(textObjects) {
  var retSize = 0;
  for(var i = 0; i < textObjects.length; i ++) {
    if(textObjects[i].pointSize >= retSize) {
      retSize = textObjects[i].pointSize;
    }
  }
  return retSize;
}

var checkOverflow = function(frame) {
  return frame.overflows
}

var increasePointSize = function(textObjects, point) {
  for(var i = 0; i < textObjects.length; i ++) {
    currentPointSize += point;
    textObjects[i].pointSize += point;
  }
}

var setPointSize = function(frame, point) {
  point -= INCREMENT;
  frame.parentStory.pointSize = point;
}

var textframe = app.selection[0];
var texts = textframe.texts
var overflow = false;

var currentPointSize = getPointSize(texts);

while(!checkOverflow(textframe)) {
  increasePointSize(texts, INCREMENT);
}

setPointSize(textframe, currentPointSize)
