//from random import randint
//import copy


class Player  {
    constructor(name,time){
        this.name = name;
        this.time = time;
        this.color = "null"
        this.pieces = [];
        this.check = false;
    }

    getName(){
        return this.name;
    }
    setColor(color){
        this.color = color;
    }

    getColor(){
        return this.color;
    }

    getTime(){
        return this.time;
      }
    inCheck(){
        return this.check;
    }
}

class Piece{
    constructor(color, name, location){

        this.color = color;
        this.name = name;
        this.location = location;  //  (x,y)    location[0] = x, location[1] = y
        this.moved = false;
        this.url = "null";
      }

    getName(){
        if((this.name === 'king') || this.name === 'knight'){
            return this.name.slice(0,2);
        }
        else{
            return this.name.slice(0,1);;
        }
    }

    getColor(){
        return this.color;
      }

    getCoords(){
        return this.location;
      }


}









class Empty extends Piece {
    constructor(color,name,location){
        super(color,name,location);
        this.url = "Empty";
    }
    movesTo(){
        return;
      }
    legalPattern(xy,game){
        return false;
    }

    deepCopy(){
      var copy = new Empty(this.color,this.name,this.location);
      return copy;
    }
}

class Knight extends Piece{
    constructor(color,name,location){
        super(color,name,location);
        if(String(color) === 'white'){
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_nlt60.png"
        }else{
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_ndt60.png"
        }
      }

    deepCopy(){
      var copy = new Knight(this.color,this.name,this.location);
      return copy;
    }
    moves(){
        return;
      }
    legalPattern(xy,game){
        var x1 = this.location[0];
        var y1 = this.location[1];
        var x2 = xy[0];
        var y2 = xy[1];
        if (((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)) == 5){
            if (x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
                if (game[y2][x2].getColor() == this.getColor()){
                    return false;
                }
                return true;
            return false;
        }else{
            return false;
          }
        }
      }
}

class Bishop extends Piece{
    constructor(color,name,location){
        super(color,name,location);
        if(String(color) ==='white'){
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_blt60.png"
        }else{
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_bdt60.png"
        }
    }
    deepCopy(){
      var copy = new Bishop(this.color,this.name,this.location);
      return copy;
    }
    moves(){
        return;
    }

    legalPattern(xy,game){
        var x1 = this.location[0];
        var y1 = this.location[1];
        var x2 = xy[0];
        var y2 = xy[1];
        var xdiff = x2-x1;
        var ydiff = y2-y1;

        if(ydiff != 0){ //
            if(abs((xdiff)/(ydiff)) == 1){//moves like bishop
                if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
                    //for each square on path to move, is there an empty square? if not false
                    var reflect = 1;
                    if ((xdiff/ydiff) < 0){
                        reflect = -1;
                    }
                    if(xdiff > 0){ //right down
                        var x = x1+1;
                        var y = y1 + reflect*1;
                        while(x <= x2){
                            square = game[y][x];
                            if(!(square instanceof Empty)){
                                if(x == x2){
                                    if(!(square.getColor().equals(this.getColor()))){
                                        return true;
                                    }
                                    return false;
                                }
                                return false;
                            }
                            x = x+1;
                            y = y + reflect*1;
                        }
                        return true;
                    }
                    else{
                        var x = x1-1;
                        var y = y1 + reflect*1;
                        while(x >= x2){
                            square = game[y][x];
                            if(!(square instanceof Empty)){
                                if(x == x2){
                                    if(!(square.getColor().equals(this.getColor()))){
                                        return true;
                                    }
                                    return false;
                                }
                                return false;
                            }
                            x = x-1;
                            y = y + reflect*1;
                        }
                        return true;
                    return true;
                  }
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }else{ //if it doesnt move like a bishop
            return false;
        }

      }


}

class Pawn extends Piece{
    constructor(color,name,location, moved){
        super(color,name,location);
        this.moved = moved;
        if(String(color) === 'white'){
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_plt60.png"
        }else{
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_pdt60.png"
        }

    }
    deepCopy(){
      var copy = new Pawn(this.color,this.name,this.location,this.moved);
      return copy;
    }
    moves(){
        return;
    }

    legalPattern(xy,game){
        var x1 = this.location[0];
        var y1 = this.location[1];


        var x2 = xy[0];
        var y2 = xy[1];
        var xdiff = x2-x1;
        var ydiff = y2-y1;


        if((ydiff == 1 && this.getColor().equals('white')) || (ydiff == -1 && this.getColor().equals('black'))){
            if(xdiff == -1 || xdiff == 0 || xdiff == 1){
                if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
                    if(game[y2][x2].getColor().equals(this.getColor())){
                        return false;
                    }
                    return true;
                }
                return false;
            }
            return false;
        }
        else if((ydiff == 2 && this.getColor().equals('white')) || (ydiff == -2 && this.getColor().equals('black'))){
            if(this.moved == 1){
                return false;
            }
            if(xdiff == 0){
                if(y2 < 8 && y2 > -1){
                    if(game[y2][x2].getColor().equals(this.getColor())){
                        return false;
                    }
                    return true;
                }
                return false;
            }
            return false;
        }
        else{
            return false;
        }
      }
}

class Rook extends Piece{
    constructor(color,name,location){
        super(color,name,location);
        if(String(color) === 'white'){
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_rlt60.png"
        }else{
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_rdt60.png"
        }
    }
    deepCopy(){
      var copy = new Rook(this.color,this.name,this.location,this.moved);
      return copy;
    }
    moves(){
        return;
    }
    legalPattern(xy,game){
        var x1 = this.location[0];
        var y1 = this.location[1];
        var x2 = xy[0];
        var y2 = xy[1];
        var xdiff = x2-x1;
        var ydiff = y2-y1;
        if((ydiff == 0) != (xdiff == 0)){ //moves like rook
            if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
                //for each square on path to move, is there an empty square or do you run into a piece? if not good to go
                if(xdiff != 0){ //moving horizontally
                    if(xdiff > 0){ //moving to the right
                        var x1plus = x1+1;
                        while(x1plus <= x2){ //before you reach your move
                            square = game[y1][x1plus];
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(x1plus == x2){//reached destination
                                    if(!(square.getColor().equals(this.getColor()))){ //if destination square contains an enemy piece
                                        return true;
                                      }
                                    return false; //friendly fire
                                  }
                                return false; //piece in the way
                              }
                            x1plus = x1plus+1;
                        }
                        return true;
                    }
                    else{
                        var x1minus = x1-1
                        while(x1minus >= x2){ //before you reach your move
                            square = game[y1][x1minus]
                            if (!(square instanceof Empty)){ //is the current square empty
                                if(x1minus == x2){//reached destination
                                    if(!(square.getColor().equals(this.getColor()))){ //if destination square contains an enemy piece
                                        return true;
                                      }
                                    return false; //friendly fire
                                  }
                                return false; //piece in the way
                              }
                            x1minus = x1minus-1;
                          }
                        return true;
                      }
                  }
                else{//moving vertically
                    if(ydiff > 0){ //moving to the right
                        var y1plus = y1+1;
                        while(y1plus <= y2){ //before you reach your move
                            square = game[y1plus][x1];
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(y1plus == y2){//reached destination
                                    if(!(square.getColor().equals(this.getColor()))){ //if destination square contains an enemy piece
                                        return true;
                                      }
                                    return false; //friendly fire
                                  }
                                return false //piece in the way
                              }
                            y1plus = y1plus+1;
                          }
                        return true;
                      }
                    else{
                        var y1minus = y1-1
                        while(y1minus >= y2){ //before you reach your move
                            square = game[y1minus][x1]
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(y1minus == y2){//reached destination
                                    if(!(square.getColor().equals(this.getColor()))){ //if destination square contains an enemy piece
                                        return true;
                                      }
                                    return false; //friendly fire
                                  }
                                return false; //piece in the way
                              }
                            y1minus = y1minus-1
                        return true;
                          }
                      }
                }
              }
            else{//off the board
                return false;
              }
          }
        else{ //if it doesnt move like a rook
            return false;
        }
      }
    }




class Queen extends Piece {
    constructor(color,name,location){
        super(color,name,location);
        if(String(color) === 'white'){
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_qlt60.png"
        }else{
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_qdt60.png"
        }
      }
    deepCopy(){
      var copy = new Queen(this.color,this.name,this.location);
      return copy;
    }
    moves(){
        return;
      }

    legalPattern(xy,game){
        var x1 = this.location[0];
        var y1 = this.location[1];
        var x2 = xy[0];
        var y2 = xy[1];
        var xdiff = x2-x1;
        var ydiff = y2-y1;

        if((ydiff == 0) != (xdiff == 0)){ //moves like rook
            if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
                //for each square on path to move, is there an empty square or do you run into a piece? if not good to go
                if(xdiff != 0){ //moving horizontally
                    if(xdiff > 0){ //moving to the right
                        var x1plus = x1+1;
                        while(x1plus <= x2){ //before you reach your move
                            square = game[y1][x1plus];
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(x1plus == x2){//reached destination
                                    if(!(square.getColor().equals(this.getColor()))){ //if destination square contains an enemy piece
                                        return true;
                                      }
                                    return false; //friendly fire
                                  }
                                return false; //piece in the way
                              }
                            x1plus = x1plus+1;
                        }
                        return true;
                    }
                    else{
                        var x1minus = x1-1
                        while(x1minus >= x2){ //before you reach your move
                            square = game[y1][x1minus]
                            if (!(square instanceof Empty)){ //is the current square empty
                                if(x1minus == x2){//reached destination
                                    if(!(square.getColor().equals(this.getColor()))){ //if destination square contains an enemy piece
                                        return true;
                                      }
                                    return false; //friendly fire
                                  }
                                return false; //piece in the way
                              }
                            x1minus = x1minus-1;
                          }
                        return true;
                      }
                  }
                else{//moving vertically
                    if(ydiff > 0){ //moving to the right
                        var y1plus = y1+1;
                        while(y1plus <= y2){ //before you reach your move
                            square = game[y1plus][x1];
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(y1plus == y2){//reached destination
                                    if(!(square.getColor().equals(this.getColor()))){ //if destination square contains an enemy piece
                                        return true;
                                      }
                                    return false; //friendly fire
                                  }
                                return false //piece in the way
                              }
                            y1plus = y1plus+1;
                          }
                        return true;
                      }
                    else{
                        var y1minus = y1-1
                        while(y1minus >= y2){ //before you reach your move
                            square = game[y1minus][x1]
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(y1minus == y2){//reached destination
                                    if(!(square.getColor().equals(this.getColor()))){ //if destination square contains an enemy piece
                                        return true;
                                      }
                                    return false; //friendly fire
                                  }
                                return false; //piece in the way
                              }
                            y1minus = y1minus-1
                        return true;
                          }
                      }
                }
              }
            else{//off the board
                return false;
              }
          }
          else if(ydiff != 0){ //
              if(abs((xdiff)/(ydiff)) == 1){//moves like bishop
                  if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
                      //for each square on path to move, is there an empty square? if not false
                      var reflect = 1;
                      if ((xdiff/ydiff) < 0){
                          reflect = -1;
                      }
                      if(xdiff > 0){ //right down
                          var x = x1+1;
                          var y = y1 + reflect*1;
                          while(x <= x2){
                              square = game[y][x];
                              if(!(square instanceof Empty)){
                                  if(x == x2){
                                      if(!(square.getColor().equals(this.getColor()))){
                                          return true;
                                      }
                                      return false;
                                  }
                                  return false;
                              }
                              x = x+1;
                              y = y + reflect*1;
                          }
                          return true;
                      }
                      else{
                          var x = x1-1;
                          var y = y1 + reflect*1;
                          while(x >= x2){
                              square = game[y][x];
                              if(!(square instanceof Empty)){
                                  if(x == x2){
                                      if(!(square.getColor().equals(this.getColor()))){
                                          return true;
                                      }
                                      return false;
                                  }
                                  return false;
                              }
                              x = x-1;
                              y = y + reflect*1;
                          }
                          return true;
                      return true;
                    }
                  }
                  else{
                      return false;
                  }
              }
              else{
                  return false;
              }
          }else{ //if it doesnt move like a bishop or rook
              return false;
          }

        }
}


class King extends Piece{
    constructor(color,name,location,moved){
        super(color,name,location);
        this.moved = moved;
        if(String(color) === 'white'){
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_klt60.png"
        }else{
          this.url = "C:/Users/rbisaccia/Desktop/ChessAgent/frontend/Chess_kdt60.png"
        }
      }
    deepCopy(){
      var copy = new King(this.color,this.name,this.location,this.moved);
      return copy;
    }
    moves(){
        return;
      }

    legalPattern(xy,game){
        var x1 = this.location[0];
        var y1 = this.location[1]
        var x2 = xy[0];
        var y2 = xy[1];

        if(((x2-x1)*(x2-x2) + (y2-y1)*(y2-y1) <=2) && !(x2-x1==0 && y2-y1==0)){
            if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
                if(game[y2][x2].getColor().equals(this.getColor())){
                    return false;
                  }
                return true;
              }
            else{
                return false;
              }
          }
        else{
            return false;
          }
      }
}

function color(i){
    if(i == 0 || i == 1){
        return "white";
      }
    else if(i == 6 || i == 7){
        return "black";
      }
    else{
        return "empty";
      }
}


function xTranslate(file){
    return file.charCodeAt(0) - 97;
  }


function yTranslate(rank){
    return parseInt(rank) - 1;
  }

export class Game{//    Game.move([piece, x, y])      #move is defined as move = [piece, x, y]
    constructor(time,p1name, p2name){

        this.p1 = new Player(p1name, time);
        this.p2 = new Player(p2name, time);

        this.color = Math.floor(Math.random() * 2);
        this.turn = 'null';
        if(this.color == 0){
            this.p1.setColor("white");
            this.p2.setColor("black");
            this.turn = this.p1;
          }
        else{
            this.p1.setColor("black");
            this.p2.setColor("white");
            this.turn = this.p2;
        }


        this.game = this.initializeGame();    //   game[][]
    }
    getPlayer(color){
        if(String(color) === "white"){
            return this.p1;
          }
        else if(String(color) === "black"){
            return this.p2;
          }
        else{
            return false;
          }
      }

    returnOpposingPieces(color){
        if(color.equals('white')){
            return this.getPlayer('black').pieces;
          }
        return this.getPlayer('white').pieces;
      }
    getKing(color){
        p = this.getPlayer(color);
        return p.pieces[4];
    }


    selfCheck(move){ //check if a move puts yourthis in check
        var xy = move[0].getCoords();
        var color = move[0].getColor();
        var x0 = xy[0];
        var y0 = xy[1];
        var x1 = move[1];
        var y1 = move[2];
        var temp0 = this.game[y0][x0].deepCopy();
        var temp1 = this.game[y1][x1].deepCopy();
        this.game[y1][x1] = this.game[y0][x0].deepCopy();
        this.game[y1][x1].location = (x1, y1);
        this.game[y0][x0] = new Empty("null", "empty",(x0,y0));
        var king = this.getKing(color);
        var kingcoords = (king.getCoords()[0], king.getCoords()[1]);
        var opposites = this.returnOpposingPieces(color);
        for(var i = 0; i < 16; i++){
            var piece = opposites[i]
            if(piece.legalPattern(kingcoords,this.game)){
                //undo move
                this.game[y0][x0] = temp0.deepCopy();
                this.game[y1][x1] = temp1.deepCopy();
                return true;
              }
          }
        //undo move
        this.game[y0][x0] = temp0.deepCopy();
        this.game[y1][x1] = temp1.deepCopy();
        return false;

    }
    isLegal(move){
        //move is defined as move = [piece, x, y]
        piece = move[0];
        x2 = move[1];
        y2 = move[2];


        if(piece.legalPattern((x2,y2), this.game)){//can the piece move in that pattern?
            if(!this.selfCheck(move)){ //does the move not put you in check?
                return true;
              }
            else{//move puts you in check
                return false;
              }
          }
        return false;

      }

    movePiece(move){
        if(this.isLegal(move)){
            x0,y0 = move[0].getCoords();
            x1,y1 = move[1],move[2];
            this.game[y1][x1] = move[0].deepCopy();
            this.game[y1][x1].location = (x1,y1);
            this.game[y0][x0] = new Empty("null","empty",(x0,y0));
            return true;
          }
        else{
            //do not make the move, return control to color that attempted to make the move
            return false;
        }
      }


    translateExecute(moveString){  //string will come in like "e2e4"

        x1 = xTranslate(moveString[0]);
        y1 = yTranslate(moveString[1]);
        piece = this.game[y1][x1];
        coord = piece.getCoords();


        x2 = xTranslate(moveString[2]);
        y2 = yTranslate(moveString[3]);


        this.movePiece((piece,x2,y2));
    }

    printGame(){
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                console.log(this.game[i][j].getName() + " ");
            }
            console.log("\n")
        }
    }



    printPieces(){
        p1 = this.p1
        p2 = this.p2
        for(i = 0; i < 16; i++){
            console.log(p1.pieces[i].getName() + " ")
            console.log(p2.pieces[i].getName() + "\n")
          }
    }


    initializeGame(){
        var game = [];
        /*Lr0 Lk1 Lb2 q3 k4 rb5 rk6 rr7 pawns 8-15 in player.pieces array irrespective of color */
        for(var i = 0; i < 8; i++){
            var row = [];
            var c = color(i);
            var player = this.getPlayer(c);
            if(i == 0 || i == 7){
                var lrook = new Rook(c, "rook", (0,i));
                var lknight = new Knight(c, "knight",(1,i));
                var lbishop = new Bishop(c, "bishop",(2,i));

                row.push(lrook);
                row.push(lknight);
                row.push(lbishop);

                player.pieces.push(lrook);
                player.pieces.push(lknight);
                player.pieces.push(lbishop);

                if(i == 0){
                    var wQueen = new Queen(c, "queen",(3,i));
                    var wKing = new King(c, "king",(4,i));
                    row.push(wQueen);
                    row.push(wKing);
                    player.pieces.push(wQueen);
                    player.pieces.push(wKing);
                  }
                else{
                    var bKing = new King(c, "king",(3,i));
                    var bQueen = new Queen(c, "queen",(4,i));
                    row.push(bKing);
                    row.push(bQueen);
                    player.pieces.push(bQueen);
                    player.pieces.push(bKing);
                  }


                var rBishop = new Bishop(c, "bishop",(5,i));
                var rKnight =  new Knight(c, "knight",(6,i));
                var rRook = new Rook(c, "rook",(7,i));
                row.push(rBishop);
                row.push(rKnight);
                row.push(rRook);
                player.pieces.push(rBishop);
                player.pieces.push(rKnight);
                player.pieces.push(rRook);

              }
            else if(i == 1 || i == 6){
                for(var j=0; j < 8; j++){
                    var pawn = new Pawn(c, "pawn",(j,i),"");
                    row.push(pawn);
                    player.pieces.push(pawn);
                  }
              }
            else{
                for(var k = 0; k < 8; k++){
                    row.push(new Empty("null", "empty",(k,i), "empty"));
                }
              }
            game.push(row);
          }


      return game;

      }


    state(){
        //outside will call this function to get access to state
        return gameState; //where gamestate is an array of relevant game info
      }

    checkMate(){
        return false;
      }
}



/*
getMove(chessGame){//should be handled by seperate user interface library at some point
    inp = input("Enter Move: ");
    return inp; //needs to handle move changes and disable the screen for the player who is not currently making a move
}
*/
