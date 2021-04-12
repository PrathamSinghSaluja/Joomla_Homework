var lineOffset = 4;
var anchrSize = 2;

var mousedown = false;
var clickedArea = {box: -1, pos:'o'};
var x1 = -1;
var y1 = -1;
var x2 = -1;
var y2 = -1;
// var postBtn = document.querySelectorAll('button');
var boxes = [];
var tmpBox = null;
var ans = [];

const jsonString = boxes;


document.getElementById("canvas").onmousedown = function(e) {
  mousedown = true;
  clickedArea = findCurrentArea(e.offsetX, e.offsetY);
  x1 = e.offsetX;
  y1 = e.offsetY;
  x2 = e.offsetX;
  y2 = e.offsetY;
};



document.getElementById("canvas").onmouseup = function(e) {
	if (clickedArea.box == -1 && tmpBox != null) {
  	boxes.push(tmpBox);
  } else if (clickedArea.box != -1) {
  	var selectedBox = boxes[clickedArea.box];
    if (selectedBox.x1 > selectedBox.x2) {
    	var previousX1 = selectedBox.x1;
      selectedBox.x1 = selectedBox.x2;
      selectedBox.x2 = previousX1;
    }
    if (selectedBox.y1 > selectedBox.y2) {
    	var previousY1 = selectedBox.y1;
      selectedBox.y1 = selectedBox.y2;
      selectedBox.y2 = previousY1;
    }
  }
  clickedArea = {box: -1, pos:'o'};
  tmpBox = null;
  mousedown = false;
  console.log(boxes);
  ans = [boxes[0]['x1'], boxes[0]['x2'], boxes[0]['y1'], boxes[0]['y2']]
  document.getElementById('demo').innerHTML = ans;
  

  

  // const postData = () => {
  //   var xhr = new XMLHttpRequest(),
  //         jsonArr,
  //         method="GET",
  //         jsonPath = "./data.json";
  
  //   xhr.open("POST", jsonPath, true);
  //   xhr.onreadystatechange = function(){
  //     if(xhr.readyState == 4 && xhr.status == 200){
  //       jsonArr = JSON.parse(xhr.responseText);
  
  //       jsonArr.push(ans);
  //       xhr.open("POST", jsonPath, true);
  //       xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  //       xhr.send("jsonText="+JSON.stringify(jsonArr))
  //     }
  //   }
  
  //   xhr.send(null);
  //   // xhr.setRequestHeader("Content-Type", "application/json");
  //   // xhr.send(jsonString);
  // }
  
 
  
  // postBtn.addEventListener('click', postData);




  // console.log(jsonString);
  
};

const postData = () => {
  localStorage.setItem('x1', JSON.stringify(boxes[0]['x1']));
  localStorage.setItem('x2', JSON.stringify(boxes[0]['x2']));
  localStorage.setItem('y1', JSON.stringify(boxes[0]['y1']));
  localStorage.setItem('y2', JSON.stringify(boxes[0]['y2']));
}

var ans2 = JSON.parse(localStorage.getItem('mystorage'))

console.log(ans2);


document.getElementById("canvas").onmouseout = function(e) {
	if (clickedArea.box != -1) {
  	var selectedBox = boxes[clickedArea.box];
    if (selectedBox.x1 > selectedBox.x2) {
    	var previousX1 = selectedBox.x1;
      selectedBox.x1 = selectedBox.x2;
      selectedBox.x2 > previousX1;
    }
    if (selectedBox.y1 > selectedBox.y2) {
    	var previousY1 = selectedBox.y1;
      selectedBox.y1 = selectedBox.y2;
      selectedBox.y2 > previousY1;
    }
  }
  mousedown = false;
  clickedArea = {box: -1, pos:'o'};
  tmpBox = null;
};
document.getElementById("canvas").onmousemove = function(e) {
  if (mousedown && clickedArea.box == -1) {
    x2 = e.offsetX;
    y2 = e.offsetY;
    redraw();
  } else if (mousedown && clickedArea.box != -1) {
    x2 = e.offsetX;
    y2 = e.offsetY;
    xOffset = x2 - x1;
    yOffset = y2 - y1;
    x1 = x2;
    y1 = y2;

    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'tl' ||
        clickedArea.pos == 'l'  ||
        clickedArea.pos == 'bl') {
      boxes[clickedArea.box].x1 += xOffset;
    }
    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'tl' ||
        clickedArea.pos == 't'  ||
        clickedArea.pos == 'tr') {
      boxes[clickedArea.box].y1 += yOffset;
    }
    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'tr' ||
        clickedArea.pos == 'r'  ||
        clickedArea.pos == 'br') {
      boxes[clickedArea.box].x2 += xOffset;
    }
    if (clickedArea.pos == 'i'  ||
        clickedArea.pos == 'bl' ||
        clickedArea.pos == 'b'  ||
        clickedArea.pos == 'br') {
      boxes[clickedArea.box].y2 += yOffset;
    }
    redraw();
  }
}

function redraw() {
  // canvas.width = canvas.width;
  var context = document.getElementById("canvas").getContext('2d');
  context.clearRect(0, 0, 800, 600);
  context.beginPath();
  for (var i = 0; i < boxes.length; i++) {
    drawBoxOn(boxes[i], context);
  }
  if (clickedArea.box == -1) {
    tmpBox = newBox(x1, y1, x2, y2);
    if (tmpBox != null) {
      drawBoxOn(tmpBox, context);
    }
  }
}

function findCurrentArea(x, y) {
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    xCenter = box.x1 + (box.x2 - box.x1) / 2;
    yCenter = box.y1 + (box.y2 - box.y1) / 2;
    if (box.x1 - lineOffset <  x && x < box.x1 + lineOffset) {
      if (box.y1 - lineOffset <  y && y < box.y1 + lineOffset) {
        return {box: i, pos:'tl'};
      } else if (box.y2 - lineOffset <  y && y < box.y2 + lineOffset) {
        return {box: i, pos:'bl'};
      } else if (yCenter - lineOffset <  y && y < yCenter + lineOffset) {
        return {box: i, pos:'l'};
      }
    } else if (box.x2 - lineOffset < x && x < box.x2 + lineOffset) {
      if (box.y1 - lineOffset <  y && y < box.y1 + lineOffset) {
        return {box: i, pos:'tr'};
      } else if (box.y2 - lineOffset <  y && y < box.y2 + lineOffset) {
        return {box: i, pos:'br'};
      } else if (yCenter - lineOffset <  y && y < yCenter + lineOffset) {
        return {box: i, pos:'r'};
      }
    } else if (xCenter - lineOffset <  x && x < xCenter + lineOffset) {
      if (box.y1 - lineOffset <  y && y < box.y1 + lineOffset) {
        return {box: i, pos:'t'};
      } else if (box.y2 - lineOffset <  y && y < box.y2 + lineOffset) {
        return {box: i, pos:'b'};
      } else if (box.y1 - lineOffset <  y && y < box.y2 + lineOffset) {
        return {box: i, pos:'i'};
      }
    } else if (box.x1 - lineOffset <  x && x < box.x2 + lineOffset) {
      if (box.y1 - lineOffset <  y && y < box.y2 + lineOffset) {
        return {box: i, pos:'i'};
      }
    }
  }
  return {box: -1, pos:'o'};
}

function newBox(x1, y1, x2, y2) {
  boxX1 = x1 < x2 ? x1 : x2;
  boxY1 = y1 < y2 ? y1 : y2;
  boxX2 = x1 > x2 ? x1 : x2;
  boxY2 = y1 > y2 ? y1 : y2;
  if (boxX2 - boxX1 > lineOffset * 2 && boxY2 - boxY1 > lineOffset * 2) {
    return {x1: boxX1,
            y1: boxY1,
            x2: boxX2,
            y2: boxY2,
            lineWidth: 1,
            color: 'DeepSkyBlue'};
  } else {
    return null;
  }
}

function drawBoxOn(box, context) {
 
  var x1 = localStorage.getItem('x1');
  var x2 = localStorage.getItem('x2');
  var y1 = localStorage.getItem('y1');
  var y2 = localStorage.getItem('y2');

  if(!x1){

    xCenter = box.x1 + (box.x2 - box.x1) / 2;
    yCenter = box.y1 + (box.y2 - box.y1) / 2;
  
    context.strokeStyle = box.color;
    context.fillStyle = box.color;
  

    context.rect(box.x1, box.y1, (box.x2 - box.x1), (box.y2 - box.y1));

    context.lineWidth = box.lineWidth;
    context.stroke();
  
    context.fillRect(box.x1 - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(box.x1 - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(box.x1 - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(xCenter - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(xCenter - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(xCenter - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(box.x2 - anchrSize, box.y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(box.x2 - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(box.x2 - anchrSize, box.y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
  }
  else{

    xCenter = x1 + (x2 - x1) / 2;
    yCenter = y1 + (y2 - y1) / 2;
  
    context.strokeStyle = box.color;
    context.fillStyle = box.color;
  

    context.rect(x1, y1, (x2 - x1), (y2 - y1));

    context.lineWidth = box.lineWidth;
    context.stroke();
  
    context.fillRect(x1 - anchrSize, y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(x1 - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(x1 - anchrSize, y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(xCenter - anchrSize, y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(xCenter - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(xCenter - anchrSize, y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(x2 - anchrSize, y1 - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(x2 - anchrSize, yCenter - anchrSize, 2 * anchrSize, 2 * anchrSize);
    context.fillRect(x2 - anchrSize, y2 - anchrSize, 2 * anchrSize, 2 * anchrSize);

  }


 
  
}
