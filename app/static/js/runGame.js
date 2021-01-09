var chessGame = new Game("5","cole","computer");
chessGame.printGame();

var timer = null;
var clicked = false;
var currentImageUrl;
var currentImage;
var id;
var lastX = 0;
var lastY = 0;
var _piece;
var cont = document.getElementById("contain");
var promContain;
var checkM = false;
var promotedPiece;
var promotedNum = 0;
var promoted = false;



function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}



function clickListener(event){
  if (debug_output) console.log('i');



  var x = event.clientX;
  var y = event.clientY;


  var baseX = (Math.floor(x / 100));
  var baseY = (Math.floor(y / 100));

  var pX = _piece.location[0];
  var pY = _piece.location[1];

  if (debug_output) console.log(`in clicklistener at (${baseX}, ${baseY}) and (${pX}, ${pY})`);

  if(baseY - pY != 0){
    if (debug_output) console.log('invalid promotion selection in the y direction');
    return;
  }
  if (debug_output) console.log('i');

  if(baseX - pX == 0){
    //pawn
    promotedNum = promotedNum + 1;
    promotedPiece = new Pawn(`${_piece.color}`, `pawn`, _piece.location);
    promotedPiece.id = `pp${promotedNum}`;
  }else if(baseX - pX == 1){
    //rook
    promotedNum = promotedNum + 1;
    promotedPiece = new Rook(`${_piece.color}`, `rook`, _piece.location);
    promotedPiece.id = `pr${promotedNum}`;
  }else if(baseX - pX == 2){
    //knight
    promotedNum = promotedNum + 1;
    promotedPiece = new Knight(`${_piece.color}`, `knight`, _piece.location);
    promotedPiece.id = `pn${promotedNum}`;
  }else if(baseX - pX == 3){
    //bishop
    promotedNum = promotedNum + 1;
    promotedPiece = new Bishop(`${_piece.color}`, `bishop`, _piece.location);
    promotedPiece.id = `pb${promotedNum}`;
  }else if(baseX- pX == 4){
    //queen
    promotedNum = promotedNum + 1;
    promotedPiece = new Queen(`${_piece.color}`, `queen`, _piece.location);
    promotedPiece.id = `pq${promotedNum}`;
  }else{
    if (debug_output) console.log('invalid promotion selection in the X direction');
    return;
  }

  chessGame.promotions.push(promotedPiece.deepCopy());
  if(promotedPiece.color == chessGame.p1.color){
    chessGame.p1.pieces.push(promotedPiece.deepCopy())
  }else{
    chessGame.p2.pieces.push(promotedPiece.deepCopy())
  }

  chessGame.game[promotedPiece.location[1]][promotedPiece.location[0]] = promotedPiece.deepCopy();
  _piece = promotedPiece.deepCopy();




  if(promotedPiece.color == "white"){
    document.body.removeChild(document.getElementById("wp"));
    document.body.removeChild(document.getElementById("wr"));
    document.body.removeChild(document.getElementById("wn"));
    document.body.removeChild(document.getElementById("wb"));
    document.body.removeChild(document.getElementById("wq"));
  }else{
    document.body.removeChild(document.getElementById("bp"));
    document.body.removeChild(document.getElementById("br"));
    document.body.removeChild(document.getElementById("bn"));
    document.body.removeChild(document.getElementById("bb"));
    document.body.removeChild(document.getElementById("bq"));
  }

  promoted = true;
  document.removeEventListener("mousedown", clickListener);
  cont.disabled = false;
  document.getElementById("contain").addEventListener("mousedown", dragStart);
  document.getElementById("contain").addEventListener("mouseup", drop);
  document.getElementById("contain").addEventListener("mouseover", dragEnter);
  document.getElementById("contain").addEventListener("mouseout", dragLeave);
  document.getElementById("contain").addEventListener("mousemove", dragging);
  //cont.visibility = "visible";
  //check to see if new piece is check
  //also remove Pawn and set current image to the promoted piece;
  currentImage.setAttribute('href', _piece.url);
  currentImage.setAttribute('id', _piece.id);
  return;

}

function dragEnter(event){
  //check if the move is legal
  return;

}

function dragLeave(event){
  //event.target.parentNode.removeChild(event.target);
  return;
}

function dragOver(event){
  //highlight the square that is being dragged over
  return;

}

function dragging(event){

  //move the position of the piece to the current location of the pointer
  if(checkM == true){
    return;
  }
  if (clicked){
    if(id == 'Empty'){
      return;
    }
    var xx = event.clientX;
    var yy = event.clientY;
    xx = xx-50;
    yy = yy-50;
    var im = document.getElementById(id);
    im.setAttribute('x', xx.toString());
    im.setAttribute('y', yy.toString());

    //console.log(`mouseclick: (${xx}, ${yy})   img: (${im.x}, ${im.y})`);


    //test to see if coordinates are changing
    //var newx = document.getElementById(id).x;
    //var newy = document.getElementById(id).y;
    //console.log(`updated im: (${newx}, ${newy})`);
  }


}



function drop(event){
  //clearInterval(timer)
  if(checkM == true){
    return;
  }
  var x = event.clientX;
  var y = event.clientY;
  if (debug_output) console.log('wants a drop at'.concat(x,y));

  var baseX = (Math.floor(x / 100));
  var baseY = (Math.floor(y / 100));
  if(id == 'Empty'){
    clicked = false;
    return;
  }
  if(chessGame.turn != _piece.color){
    if (debug_output) console.log('not ur turn');
    clicked = false;
    currentImage.setAttribute('x', ((_piece.location[0])*100).toString());
    currentImage.setAttribute('y', ((_piece.location[1])*100).toString());
    return;
  }


  if (debug_output) console.log(`moving to (${baseX},${baseY})`);
  if (debug_output) console.log(`${_piece.id} at (${_piece.location[0]},${_piece.location[1]})`);


  var movingTo = chessGame.game[baseY][baseX].deepCopy();

  var move = chessGame.movePiece([_piece, baseX, baseY]);

  _piece = move[2];

  var rook;
  if(move.length == 4){
    if (debug_output) console.log('castling');
    _piece = move[3];
    rook = move[2];
  }
  if (debug_output) console.log(`${_piece.id} moving to (${_piece.location[0]},${_piece.location[1]})`);
  //console.log(`${chessGame.game[0][4].id}`);
  //_piece = chessGame.game[baseY][baseX];
  //after movePiece the coordinates of the chessGame reflect the move
  //currentImage.setAttribute('x', baseX.toString());
  //currentImage.setAttribute('y', baseY.toString());
  if(move[0] == true){
    if (debug_output) console.log(`removing child with id ${move[1]}`);
    document.getElementById(move[1]).setAttribute("style", "visibility:hidden");
  }

  console.log(`piece.name = ${_piece.name}   moving to ${movingTo.name}  piece.color = ${_piece.color}   baseY = ${baseY}`);

  var promotion = false;


  if(_piece.name == "pawn" && (_piece.color == "white" && baseY == 0)){
    if (debug_output) console.log('pawn promition:');
    //set up selection
    var left = (_piece.location[0])*100;
    var to = (_piece.location[1])*100;

    //console.log(`left = ${left} top = ${to}`);


    //console.log('i');
    var pwn = document.createElement("img");
    //console.log('i');
    pwn.id = "wp";
    //console.log('i');
    pwn.src = "http://174.129.83.34:80/images/Chess_plt60.png";
    pwn.style = `position: absolute; top: ${to}px; left: ${left}px; z-index: 2`;
    pwn.width = "100";
    pwn.height = "100";
    //console.log('i');

    var rk = document.createElement("img");
    rk.id = "wr";
    rk.src = "http://174.129.83.34:80/images/Chess_rlt60.png";
    var rookL = left+100;
    rk.style = `position: absolute; top: ${to}px; left: ${rookL}px; z-index: 2`;
    rk.width = "100";
    rk.height = "100";

    var n = document.createElement("img");
    n.id = "wn";
    n.src = "http://174.129.83.34:80/images/Chess_nlt60.png";
    var nL = left+200;
    n.style = `position: absolute; top: ${to}px; left: ${nL}px; z-index: 2`;
    n.width = "100";
    n.height = "100";
    //console.log('i');

    var b = document.createElement("img");
    b.id = "wb";
    b.src = "http://174.129.83.34:80/images/Chess_blt60.png";
    var bL = left+300;
    b.style = `position: absolute; top: ${to}px; left: ${bL}px; z-index: 2`;
    b.width = "100";
    b.height = "100";



    var q = document.createElement("img");
    q.id = "wq";
    q.src = "http://174.129.83.34:80/images/Chess_qlt60.png";
    var qL = left+400;
    q.style = `position: absolute; top: ${to}px; left: ${qL}px; z-index: 2`;//520
    q.width = "100";
    q.height = "100";



    document.body.appendChild(pwn);
    document.body.appendChild(rk);
    document.body.appendChild(n);
    document.body.appendChild(b);
    document.body.appendChild(q);
    currentImage.setAttribute('x', ((_piece.location[0])*100).toString());
    currentImage.setAttribute('y', ((_piece.location[1])*100).toString());
    document.getElementById("contain").removeEventListener("mousedown", dragStart);
    document.getElementById("contain").removeEventListener("mouseup", drop);
    document.getElementById("contain").removeEventListener("mouseover", dragEnter);
    document.getElementById("contain").removeEventListener("mouseout", dragLeave);
    document.getElementById("contain").removeEventListener("mousemove", dragging);
    document.addEventListener("mousedown",clickListener);

    promotion = true;
    cont.disabled = true;
    clicked = false;

    return;


    //chessGame.pawnPromotions[_p] = true; //unsolved logic bug: this does not test whether or not pawn promotion puts itself in selfcheck.

  }
  if(_piece.name == "pawn" && (_piece.color == "black" && baseY == 7)){
    if (debug_output) console.log('pawn promotion:');
    //set up selection
    var left = (_piece.location[0])*100;
    var to = (_piece.location[1])*100;


    var pwn = document.createElement("img");
    pwn.id = "bp";
    pwn.src = "http://174.129.83.34:80/images/Chess_pdt60.png";
    pwn.style = `position: absolute; top: ${to}px; left: ${left}px; z-index: 2`;
    pwn.width = "100";
    pwn.height = "100";

    var rk = document.createElement("img");
    rk.id = "br";
    rk.src = "http://174.129.83.34:80/images/Chess_rdt60.png";
    rk.style = `position: absolute; top: ${to}px; left: ${left+100}; z-index: 2px`;
    rk.width = "100";
    rk.height = "100";

    var n = document.createElement("img");
    n.id = "bn";
    n.src = "http://174.129.83.34:80/images/Chess_ndt60.png";
    n.style = `position: absolute; top: ${to}px; left: ${left+200}px; z-index: 2`;
    n.width = "100";
    n.height = "100";

    var b = document.createElement("img");
    b.id = "bb";
    b.src = "http://174.129.83.34:80/images/Chess_bdt60.png";
    b.style = `position: absolute; top: ${to}px; left: ${left+300}px; z-index: 2`;
    b.width = "100";
    b.height = "100";

    var q = document.createElement("img");
    q.id = "bq";
    q.src = "http://174.129.83.34:80/images/Chess_qdt60.png";
    q.style = `position: absolute; top: ${to}px; left: ${left+400}px; z-index: 2`;//520
    q.width = "100";
    q.height = "100";

    document.body.appendChild(pwn);
    document.body.appendChild(rk);
    document.body.appendChild(n);
    document.body.appendChild(b);
    document.body.appendChild(q);
    currentImage.setAttribute('x', ((_piece.location[0])*100).toString());
    currentImage.setAttribute('y', ((_piece.location[1])*100).toString());
    document.getElementById("contain").removeEventListener("mousedown", dragStart);
    document.getElementById("contain").removeEventListener("mouseup", drop);
    document.getElementById("contain").removeEventListener("mouseover", dragEnter);
    document.getElementById("contain").removeEventListener("mouseout", dragLeave);
    document.getElementById("contain").removeEventListener("mousemove", dragging);
    document.addEventListener("mousedown",clickListener);





    promotion = true;
    cont.disabled = true;
    clicked = false;
    return;
    //chessGame.pawnPromotions[_p] = true; //unsolved logic bug: this does not test whether or not pawn promotion puts itself in selfcheck.

  }
  currentImage.setAttribute('x', ((_piece.location[0])*100).toString());
  currentImage.setAttribute('y', ((_piece.location[1])*100).toString());



  if(move.length == 4){
    if (debug_output) console.log(`rook id = ${rook.id}`);
    var rookImage = document.getElementById(rook.id);
    rookImage.setAttribute('x', ((rook.location[0])*100).toString());
    rookImage.setAttribute('y', ((rook.location[1])*100).toString());
  }

  //if the drop is legal: then good
  //else, revert the img coordinates to go back to lastX, lastY
  if (debug_output) console.log('drop!');
  clicked = false;
  checkM = chessGame.checkMate();
  if(checkM == true){
    //stop input and display game over stuff
    if (debug_output) console.log(`checkmate`);
    var checkMateScreen = document.createElementNS("http://www.w3.org/2000/svg","rect");
    checkMateScreen.setAttribute('x', '200');
    checkMateScreen.setAttribute('y', '200');
    checkMateScreen.setAttribute('style', 'width: 400px; height: 400px; fill:blue;');
    cont.appendChild(checkMateScreen);
  }else{
    if (debug_output) console.log(`not Checkmate`);
  }

  }





function dragStart(event){
  //timer = setInterval(hello,50);
  if(checkM == true){
    return;
  }
  clicked = true;
  var x = event.clientX;
  var y = event.clientY;
  //console.log(`${chessGame.game[0][4].id}`);
  lastX = x;
  lastY = y;
  if (debug_output) console.log('start at'.concat(x,y));
  var baseX = Math.floor(x / 100);
  var baseY = Math.floor(y / 100);
  //var index = baseX*7 + baseY;
  console.log(`(${baseX},${baseY})`);

  _piece = chessGame.game[baseY][baseX]; // if the piece is grabbed at 4,0 but the location is 4,2

  currentImageUrl = _piece.url;
  id = _piece.id;
  currentImage = document.getElementById(id);
  if (debug_output) console.log(_piece.id);
  if (debug_output) console.log(`x coord: ${_piece.location[0]} y coord: ${_piece.location[1]}`);
  if (debug_output) console.log(`${currentImageUrl}`);
  //create copy of draggable image and make the old image slightly transparent


  //event.dataTransfer.setDragImage(event.target, 50, 50);
  //event.preventDefault();

}


/*
while(!chessGame.checkMate()){
     var move = getMove(chessGame);
     chessGame.translateExecute(move);
     chessGame.printGame();
  }
*/

document.getElementById("contain").addEventListener("mousedown", dragStart);
document.getElementById("contain").addEventListener("mouseup", drop);
document.getElementById("contain").addEventListener("mouseover", dragEnter);
document.getElementById("contain").addEventListener("mouseout", dragLeave);
document.getElementById("contain").addEventListener("mousemove", dragging);