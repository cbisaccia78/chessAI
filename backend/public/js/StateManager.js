//http://localhost:3000///from random import randint
//import copy


class Player  {
    constructor(name,time){
        this.name = name;
        this.time = time;
        this.color = "null"
        this.pieces = []; //[lrook, lknight, lbishop,queen, king, rbishop, rnight, rrook, 0-7pawns ]
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
        this.id = "null"
        this.pieceLoc = this.location[0] + 8;
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
        this.id = "Empty";
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

        if(color === 'white'){
          this.url = "http://localhost:3000/images/Chess_nlt60.png"
          console.log(`x value `)
          if(this.location[0] == 1){
            this.id = "b1kn";
          }else{
            this.id = "g1kn";
          }
        }else{
          this.url = "http://localhost:3000/images/Chess_ndt60.png"
          if(this.location[0] == 1){
            this.id = "b8kn";
          }else{
            this.id = "g8kn";
          }
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
            }
            return false;
        }else{
            return false;
        }
    }
}

class Bishop extends Piece{
    constructor(color,name,location){
        super(color,name,location);

        if(color ==='white'){
          this.url = "http://localhost:3000/images/Chess_blt60.png"
          if(this.location[0] == 2){
            this.id = "c1b";
          }else{
            this.id = "f1b";
          }
        }else{
          this.url = "http://localhost:3000/images/Chess_bdt60.png"
          if(this.location[0] == 2){
            this.id = "c8b";
          }else{
            this.id = "f8b";
          }
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

        //console.log(`bishop at (${game[y1][x1].location[0]}, ${game[y1][x1].location[1]})`);

        if(ydiff != 0){ //
            if(Math.abs((xdiff)/(ydiff)) == 1){//moves like bishop
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
                            var square = game[y][x];
                            if(!(square instanceof Empty)){
                                if(x == x2){
                                    if(!(square.getColor() == this.getColor())){
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
                        var y = y1 - reflect*1;
                        while(x >= x2){
                            //console.log(`bishop at (${game[y1][x1].location[0]}, ${game[y1][x1].location[1]})`);
                            //console.log(`(${x}, ${y})`);
                            var square = game[y][x];
                            if(!(square instanceof Empty)){
                                if(x == x2){
                                    if(!(square.getColor() == this.getColor())){
                                        return true;
                                    }
                                    return false;
                                }
                                return false;
                            }
                            x = x-1;
                            y = y - reflect*1;
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
        this.pieceLoc = this.location[0];
        if(color == 'white'){
          this.url = "http://localhost:3000/images/Chess_plt60.png"
          if(this.location[0] == 0){
            this.id = "a2p";
          }else if(this.location[0] == 1){
            this.id = "b2p";
          }else if(this.location[0] == 2){
            this.id = "c2p";
          }else if(this.location[0] == 3){
            this.id = "d2p";
          }else if(this.location[0] == 4){
            this.id = "e2p";
          }else if(this.location[0] == 5){
            this.id = "f2p";
          }else if(this.location[0] == 6){
            this.id = "g2p";
          }else{
            this.id = "h2p";
          }
        }else{
          this.url = "http://localhost:3000/images/Chess_pdt60.png"
          if(this.location[0] == 0){
            this.id = "a7p";
          }else if(this.location[0] == 1){
            this.id = "b7p";
          }else if(this.location[0] == 2){
            this.id = "c7p";
          }else if(this.location[0] == 3){
            this.id = "d7p";
          }else if(this.location[0] == 4){
            this.id = "e7p";
          }else if(this.location[0] == 5){
            this.id = "f7p";
          }else if(this.location[0] == 6){
            this.id = "g7p";
          }else{
            this.id = "h7p";
          }
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
        var ydiff = -1*(y2-y1);

        //console.log(`color of pawn is ${this.getColor()} with ydiff ${ydiff}`);


        if((ydiff == 1 && this.getColor() == 'white') || (ydiff == -1 && this.getColor() == 'black')){
            if(xdiff == -1 || xdiff == 0 || xdiff == 1){
                if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
                    if(game[y2][x2].getColor() == this.getColor()){
                        console.log('friendly fire!');
                        return false;
                    }
                    console.log(`true legal patern king coord ${game[0][4].id} ${game[2][4].id}`);
                    return true;
                }
                console.log('off the board');
                return false;
            }
            console.log('wrong xdiff');
            return false;
        }
        else if((ydiff == 2 && this.getColor() == 'white') || (ydiff == -2 && this.getColor() == 'black')){
            console.log('2 step');
            if(this.moved == 1){
                console.log('already moved, cannot jump 2');
                return false;
            }
            if(xdiff == 0){
                if(y2 < 8 && y2 > -1){
                    if(game[y2][x2].getColor() == this.getColor()){
                        console.log('friendly fire in 2 step');
                        return false;
                    }
                    return true;
                }
                console.log('off the board in 2 step');
                return false;
            }
            console.log('wrong xdiff in 2 step');
            return false;
        }
        else{
            console.log('issue with ydiff');
            return false;
        }
      }
}

class Rook extends Piece{
    constructor(color,name,location){
        super(color,name,location);

        if(color === 'white'){
          this.url = "http://localhost:3000/images/Chess_rlt60.png"
          if(this.location[0] == 0){
            this.id = "a1r";
          }else{
            this.id = "h1r";
          }
        }else{
          this.url = "http://localhost:3000/images/Chess_rdt60.png"
          if(this.location[0] == 0){
            this.id = "a8r";
          }else{
            this.id = "h8r";
          }
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
                            var square = game[y1][x1plus];
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(x1plus == x2){//reached destination
                                    if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
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
                            var square = game[y1][x1minus]
                            if (!(square instanceof Empty)){ //is the current square empty
                                if(x1minus == x2){//reached destination
                                    if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
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
                            var square = game[y1plus][x1];
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(y1plus == y2){//reached destination
                                    if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
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
                            var square = game[y1minus][x1];
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(y1minus == y2){//reached destination
                                    if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
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

        if(color === 'white'){
          this.url = "http://localhost:3000/images/Chess_qlt60.png"
          this.id = "d1q"
        }else{
          this.url = "http://localhost:3000/images/Chess_qdt60.png"
          this.id = "d8q"
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
                            var square = game[y1][x1plus];
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(x1plus == x2){//reached destination
                                    if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
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
                            var square = game[y1][x1minus];
                            if (!(square instanceof Empty)){ //is the current square empty
                                if(x1minus == x2){//reached destination
                                    if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
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
                            var square = game[y1plus][x1];
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(y1plus == y2){//reached destination
                                    if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
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
                            var square = game[y1minus][x1];
                            if(!(square instanceof Empty)){ //is the current square empty
                                if(y1minus == y2){//reached destination
                                    if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
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
              if(Math.abs((xdiff)/(ydiff)) == 1){//moves like bishop
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
                              var square = game[y][x];
                              if(!(square instanceof Empty)){
                                  if(x == x2){
                                      if(!(square.getColor() == this.getColor())){
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
                              var square = game[y][x];
                              if(!(square instanceof Empty)){
                                  if(x == x2){
                                      if(!(square.getColor() == this.getColor())){
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

        if(color === 'white'){
          this.url = "http://localhost:3000/images/Chess_klt60.png"
          this.id = "e1k"
        }else{
          this.url = "http://localhost:3000/images/Chess_kdt60.png"
          this.id = "e8k"
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
                if(game[y2][x2].getColor() == this.getColor()){
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
        return "black";
      }
    else if(i == 6 || i == 7){
        return "white";
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
        if(color === "white"){
            return this.p1;
          }
        else if(color === "black"){
            return this.p2;
          }
        else{
            return false;
          }
      }

    returnOpposingPieces(color){
        if(color === 'white'){
            return this.getPlayer('black').pieces;
          }
        return this.getPlayer('white').pieces;
      }
    getKing(color){
        var p = this.getPlayer(color);
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

        var x2 = move[1];
        var y2 = move[2];


        if(move[0].legalPattern([x2,y2], this.game)){//can the piece move in that pattern?
            if(!this.selfCheck(move)){ //does the move not put you in check?
              console.log(`true legal patern king coord ${this.game[0][4].id} ${this.game[2][4].id}`);
                return true;
              }
            else{//move puts you in check
                console.log('move puts you in check!')
                return false;
              }
          }
        return false;

      }

    movePiece(move){
        //console.log('before move:');
        //console.log(`${move[0].id} movetest at (${move[0].location[0]}, ${move[0].location[1]})`);
        //console.log('____________________________________________');
        /*console.log(`${this.p1.pieces[10].id} at (${this.p1.pieces[10].location[0]}, ${this.p2.pieces[10].location[1]})`);
        console.log(`${this.p1.pieces[13].id} at (${this.p1.pieces[13].location[0]}, ${this.p2.pieces[13].location[1]})`);
        console.log(`${this.p2.pieces[2].id} at (${this.p2.pieces[2].location[0]}, ${this.p2.pieces[2].location[1]})`);
        console.log(`${this.p2.pieces[5].id} at (${this.p2.pieces[5].location[0]}, ${this.p2.pieces[5].location[1]})`);
        */
        if(this.isLegal(move)){

            var x0 = move[0].getCoords()[0];
            var y0 = move[0].getCoords()[1];
            console.log(`${move[0].id} at (${x0}, ${y0})`);
            var x1 = move[1];
            var y1 = move[2];
            console.log(`(${x1}, ${y1})`);
            console.log(`${this.game[y1][x1].id}`)
            console.log(`true legal patern king coord (${this.game[0][4].location[0]}, ${this.game[0][4].location[1]}) `);
            this.game[y1][x1] = move[0].deepCopy();
            //console.log(`${this.game[y1][x1].id} post piece-switch at (${this.game[y1][x1].location[0]}, ${this.game[y1][x1].location[1]})`);
            //need to update player pieces
            this.game[y1][x1].location = [x1,y1];
            this.game[y1][x1].id = move[0].id;
            //console.log(`${this.game[y1][x1].id} post loc-switch at (${this.game[y1][x1].location[0]}, ${this.game[y1][x1].location[1]})`);
            console.log(`true legal patern king coord (${this.game[0][4].location[0]}, ${this.game[0][4].location[1]}) `);
            if(move[0].getColor() == 'white'){
              console.log(`move[0] id = ${move[0].id}`);
              this.p1.pieces[move[0].pieceLoc].location = [x1,y1];
            }else{
              console.log(`move[0] id = ${move[0].id} move[0] pieceloc = ${move[0].pieceLoc}`);
              var l;
              for(l = 0; l < 16; l++){
                console.log(this.p2.pieces[l].location);
              }
              this.p2.pieces[move[0].pieceLoc].location = [x1,y1];
            }
            //console.log(`${move[0].id} at (${move[0].getCoords()[0]}, ${move[0].getCoords()[1]})`);
            console.log(`true legal patern king coord (${this.game[0][4].location[0]}, ${this.game[0][4].location[1]}) `);
            this.game[y0][x0] = new Empty("null","empty",[x0,y0]);
            console.log(`true legal patern king coord (${this.game[0][4].location[0]}, ${this.game[0][4].location[1]}) `);


            //console.log(`${this.game[y1][x1].id} post-empty at (${this.game[y1][x1].location[0]}, ${this.game[y1][x1].location[1]})`);
            //console.log('____________________________________________');
            /*
            console.log(`${this.p1.pieces[10].id} at (${this.p1.pieces[10].location[0]}, ${this.p2.pieces[10].location[1]})`);
            console.log(`${this.p1.pieces[13].id} at (${this.p1.pieces[13].location[0]}, ${this.p2.pieces[13].location[1]})`);
            console.log(`${this.p2.pieces[2].id} at (${this.p2.pieces[2].location[0]}, ${this.p2.pieces[2].location[1]})`);
            console.log(`${this.p2.pieces[5].id} at (${this.p2.pieces[5].location[0]}, ${this.p2.pieces[5].location[1]})`);
            */
            return this.game[y1][x1];
          }
        else{
            //do not make the move, return control to color that attempted to make the move
            console.log('illegal move');
            //console.log(`${this.game[y1][x1].id} movetest at (${this.game[y1][x1].location[0]}, ${this.game[y1][x1].location[1]})`);
            //console.log('____________________________________________');
            /*
            console.log(`${this.p1.pieces[10].id} at (${this.p1.pieces[10].location[0]}, ${this.p2.pieces[10].location[1]})`);
            console.log(`${this.p1.pieces[13].id} at (${this.p1.pieces[13].location[0]}, ${this.p2.pieces[13].location[1]})`);
            console.log(`${this.p2.pieces[2].id} at (${this.p2.pieces[2].location[0]}, ${this.p2.pieces[2].location[1]})`);
            console.log(`${this.p2.pieces[5].id} at (${this.p2.pieces[5].location[0]}, ${this.p2.pieces[5].location[1]})`);
            */
            return move[0];
        }
      }


    translateExecute(moveString){  //string will come in like "e2e4"

        x1 = xTranslate(moveString[0]);
        y1 = yTranslate(moveString[1]);
        piece = this.game[y1][x1];
        coord = piece.getCoords();


        x2 = xTranslate(moveString[2]);
        y2 = yTranslate(moveString[3]);


        this.movePiece([piece,x2,y2]);
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
        var i;
        console.log('___________________________');
        for(i = 0; i < 16; i++){
            console.log(this.p1.pieces[i].getName() + " ")
            console.log(this.p2.pieces[i].getName() + "\n")
          }
        console.log('___________________________');
    }

    reverse(){
      var pawns = this.p2.pieces.slice(0,8);
      var majors = this.p2.pieces.slice(8,16);
      var j;
      for(j = 0; j < 8; j++){
        majors.push(pawns[j]);
      }
      this.p2.pieces = majors;
      this.printPieces();
    }
    initializeGame(){
        var game = [];
        /*Lr0 Lk1 Lb2 q3 k4 rb5 rk6 rr7 pawns 8-15 in player.pieces array irrespective of color */
        for(var i = 0; i < 8; i++){
            var row = [];
            var c = color(i);
            var player = this.getPlayer(c);
            if(i == 0 || i == 7){
                var lrook = new Rook(c, "rook", [0,i]);
                var lknight = new Knight(c, "knight",[1,i]);
                var lbishop = new Bishop(c, "bishop",[2,i]);

                row.push(lrook);
                row.push(lknight);
                row.push(lbishop);

                player.pieces.push(lrook);
                player.pieces.push(lknight);
                player.pieces.push(lbishop);

                var _Queen = new Queen(c, "queen",[3,i]);
                var _King = new King(c, "king",[4,i]);
                row.push(_Queen);
                row.push(_King);
                player.pieces.push(_Queen);
                player.pieces.push(_King);



                var rBishop = new Bishop(c, "bishop",[5,i]);
                var rKnight =  new Knight(c, "knight",[6,i]);
                var rRook = new Rook(c, "rook",[7,i]);
                row.push(rBishop);
                row.push(rKnight);
                row.push(rRook);
                player.pieces.push(rBishop);
                player.pieces.push(rKnight);
                player.pieces.push(rRook);

              }
            else if(i == 1 || i == 6){
                for(var j=0; j < 8; j++){
                    var pawn = new Pawn(c, "pawn",[j,i],false);
                    row.push(pawn);
                    player.pieces.push(pawn);
                  }
              }
            else{
                for(var k = 0; k < 8; k++){
                    row.push(new Empty("null", "empty",[k,i]));
                }
              }
            game.push(row);
          }

      this.reverse();
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

//chessGame.printGame();

/*
while(!chessGame.checkMate()){
     var move = getMove(chessGame);
     chessGame.translateExecute(move);
     chessGame.printGame();
  }
*/

/*
getMove(chessGame){//should be handled by seperate user interface library at some point
    inp = input("Enter Move: ");
    return inp; //needs to handle move changes and disable the screen for the player who is not currently making a move
}
*/
