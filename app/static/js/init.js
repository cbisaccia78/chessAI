var container = document.getElementById("contain");
    var topLines = []
    var sideLines = []
    for (let i = 0; i < 8; i++){
      console.log('i: ',i);
      var topLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      topLine.setAttribute("x1","0");
      topLine.setAttribute("y1", (i*100).toString());
      topLine.setAttribute("x2","800");
      topLine.setAttribute("y2", (i*100).toString());
      topLine.setAttribute("style","stroke:black");
      topLines[topLines.length] = topLine;

      for(let j = 0; j < 8; j++){
        console.log('j: ', j);
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        if((i+j)%2==0){
          rect.setAttribute("style","fill:white;");
        }else{
          rect.setAttribute("style","fill:brown;");
        }
        var xNum = i * 100;
        var yNum = j * 100;
        rect.setAttribute("x", xNum.toString());
        rect.setAttribute("y", yNum.toString());
        rect.setAttribute("width", "100");
        rect.setAttribute("height", "100");
        container.appendChild(rect);
      }
    }

    for(let k = 0; k < 8; k++){
      var sideLine = document.createElementNS("http://www.w3.org/2000/svg","line");
      sideLine.setAttribute("x1",(k*100).toString());
      sideLine.setAttribute("y1", "0");
      sideLine.setAttribute("x2",(k*100).toString());
      sideLine.setAttribute("y2", "800");
      sideLine.setAttribute("style","stroke:black");
      container.appendChild(sideLine)
      sideLines[sideLines.length] = sideLine
      container.appendChild(sideLine);
      container.appendChild(topLines[k]);
    }


    var l = document.createElementNS("http://www.w3.org/2000/svg","line");
    var r = document.createElementNS("http://www.w3.org/2000/svg","line");
    var t = document.createElementNS("http://www.w3.org/2000/svg","line");
    var b = document.createElementNS("http://www.w3.org/2000/svg","line");

    l.setAttribute("x1","0");
    l.setAttribute("y1","0");
    l.setAttribute("x2","0");
    l.setAttribute("y2","800");
    l.setAttribute("style","stroke:black; stroke-width:3");

    r.setAttribute("x1","800");
    r.setAttribute("y1","0");
    r.setAttribute("x2","800");
    r.setAttribute("y2","800");
    r.setAttribute("style","stroke:black; stroke-width:3");

    t.setAttribute("x1","0");
    t.setAttribute("y1","0");
    t.setAttribute("x2","800");
    t.setAttribute("y2","0");
    t.setAttribute("style","stroke:black; stroke-width:3");

    b.setAttribute("x1","0");
    b.setAttribute("y1","800");
    b.setAttribute("x2","800");
    b.setAttribute("y2","800");
    b.setAttribute("style","stroke:black; stroke-width:3");

    container.appendChild(l);
    container.appendChild(r);
    container.appendChild(t);
    container.appendChild(b);