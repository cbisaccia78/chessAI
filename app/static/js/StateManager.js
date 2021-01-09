
class Player  {
    constructor(name,time){
        this.name = name;
        this.time = time;
        this.color = "null"
        this.pieces = []; //[lrook, lknight, lbishop,queen, king, rbishop, rnight, rrook, 0-7pawns ]
        this.check = false;
        this.inCheck = false;
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
        this.removed = false;
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
          this.url = "http://174.129.83.34:80/images/Chess_nlt60.png"
          //console.log(`x value `)
          if(this.location[0] == 1){
            this.id = "b1kn";
          }else{
            this.id = "g1kn";
          }
        }else{
          this.url = "http://174.129.83.34:80/images/Chess_ndt60.png"
          if(this.location[0] == 1){
            this.id = "b8kn";
          }else{
            this.id = "g8kn";
          }
        }
      }

    deepCopy(){
      var copy = new Knight(this.color,this.name,this.location);
      copy.id = this.id;
      copy.pieceLoc = this.pieceLoc;
      return copy;
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
          this.url = "http://174.129.83.34:80/images/Chess_blt60.png"
          if(this.location[0] == 2){
            this.id = "c1b";
          }else{
            this.id = "f1b";
          }
        }else{
          this.url = "http://174.129.83.34:80/images/Chess_bdt60.png"
          if(this.location[0] == 2){
            this.id = "c8b";
          }else{
            this.id = "f8b";
          }
        }
    }
    deepCopy(){
      var copy = new Bishop(this.color,this.name,this.location);
      copy.id = this.id;
      copy.pieceLoc = this.pieceLoc;
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
                    var reflectX = 1;
                    var reflectY = 1;
                    if(xdiff < 0){
                        reflectX = -1;
                    }
                    if(ydiff < 0){
                      reflectY = -1;
                    }

                    var x = x1+reflectX;
                    var y = y1 + reflectY;
                    while(x != x2){
                        //console.log(`(${x}, ${y})`)
                        var square = game[y][x];
                        if(!(square.id == "Empty")){
                            if(x == x2){
                                if(!(square.getColor() == this.getColor())){
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }
                        x = x+reflectX;
                        y = y + reflectY;
                    }
                    if(!(game[y][x].getColor() == this.getColor())){
                      return true;
                    }
                    //console.log('color issue');
                    return false;


                }
                else{//off the board
                    return false;
                }
            }
            else{//wrong abs value
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
        this.passantable = false;
        this.takePassant = false;
        if(color == 'white'){
          this.url = "http://174.129.83.34:80/images/Chess_plt60.png"
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
          this.url = "http://174.129.83.34:80/images/Chess_pdt60.png"
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
      copy.id = this.id;
      copy.passantable = this.passantable;
      copy.takePassant = this.takePassant;
      copy.pieceLoc = this.pieceLoc;
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
          if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
              if(xdiff == -1 || xdiff == 1){
                    if(game[y2][x2].getColor() == "null"){
                      //console.log("evaluating possible en passant");
                        //console.log(`piece at (${x2}, ${y1}) = ${game[y1][x2].name} ${game[y1][x2].passantable}`);
                        if(game[y1][x2].passantable == true){
                          //console.log('changing takepassant value');
                          game[y1][x1].takePassant = true;
                          this.takePassant = true;
                          return true;
                        }
                        return false;
                    }else if(game[y2][x2].getColor() != this.getColor()){
                        return true;
                    }else{
                    return false;
                    }
              }else if(xdiff == 0){
                if(this.passantable == true){
                  game[y1][x1].passantable = false;
                }
                if((game[y2][x2].getColor() == "null")){
                    //add a variable to represent a pawn that just queened
                    return true;
                }
                return false;
              }else{
              //console.log('wrong xdiff');
              return false;
            }
          }
          return false;
        }
        else if((ydiff == 2 && this.getColor() == 'white') || (ydiff == -2 && this.getColor() == 'black')){
            //console.log('2 step');
            if(this.moved == 1){
                //console.log('already moved, cannot jump 2');
                return false;
            }
            this.passantable = true;
            game[y1][x1].passantable = true;
            if(xdiff == 0){
                if(y2 < 8 && y2 > -1){
                    if(game[y2][x2].name != "empty"){
                        //console.log('friendly fire in 2 step');
                        return false;
                    }
                    return true;
                }
                //console.log('off the board in 2 step');
                return false;
            }
            //console.log('wrong xdiff in 2 step');
            return false;
        }
        else{
            //console.log('issue with ydiff');
            return false;
        }
      }
}

class Rook extends Piece{
    constructor(color,name,location){
        super(color,name,location);

        if(color === 'white'){
          this.url = "http://174.129.83.34:80/images/Chess_rlt60.png"
          if(this.location[0] == 0){
            this.id = "a1r";
          }else{
            this.id = "h1r";
          }
        }else{
          this.url = "http://174.129.83.34:80/images/Chess_rdt60.png"
          if(this.location[0] == 0){
            this.id = "a8r";
          }else{
            this.id = "h8r";
          }
        }
    }
    deepCopy(){
      var copy = new Rook(this.color,this.name,this.location,this.moved);
      copy.id = this.id;
      copy.pieceLoc = this.pieceLoc;
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
                var reflectX = 1;
                var reflectY = 1;
                if(xdiff != 0){ //moving horizontally
                    if(xdiff < 0){
                      reflectX = -1;
                    }

                    var x = x1+reflectX;
                    while(x != x2){ //before you reach your move
                        var square = game[y1][x];
                        if(!(square.id == "Empty")){ //is the current square empty
                            if(x == x2){//reached destination
                                if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
                                    return true;
                                  }
                                return false; //friendly fire
                              }
                            return false; //piece in the way
                          }
                        x = x+reflectX;
                    }
                    if(!(game[y1][x].getColor() == this.getColor())){
                      return true;
                    }
                    return false;


                }
                else{//moving vertically
                    if(ydiff < 0){
                      reflectY = -1;
                    }

                    var y = y1+reflectY;
                    while(y != y2){ //before you reach your move
                        var square = game[y][x1];
                        if(!(square.id == "Empty")){ //is the current square empty
                            if(y == y2){//reached destination
                                if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
                                    return true;
                                  }
                                return false; //friendly fire
                              }
                            return false //piece in the way
                          }
                        y = y+reflectY;
                      }
                    if(!(game[y][x1].getColor() == this.getColor())){
                      return true;
                    }
                    return false;

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
          this.url = "http://174.129.83.34:80/images/Chess_qlt60.png"
          this.id = "d1q"
        }else{
          this.url = "http://174.129.83.34:80/images/Chess_qdt60.png"
          this.id = "d8q"
        }
      }
    deepCopy(){
      var copy = new Queen(this.color,this.name,this.location);
      copy.id = this.id;
      copy.pieceLoc = this.pieceLoc;
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
        var ydiff = (y2-y1);
        //console.log(`x1 = ${x1} x2 = ${x2} y1 = ${y1} y2 = ${y2} xdiff = ${xdiff} ydiff = ${ydiff}`);


        if((ydiff == 0) != (xdiff == 0)){ //moves like rook
            //console.log('queen moves like a rook');
            if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
                //for each square on path to move, is there an empty square or do you run into a piece? if not good to go
                var reflectX = 1;
                var reflectY = 1;

                if(xdiff != 0){ //moving horizontally
                    if(xdiff < 0){
                      reflectX = -1;
                    }
                    var x = x1+reflectX;
                    while(x != x2){ //before you reach your move
                        var square = game[y1][x];
                        if(!(square.id == "Empty")){ //is the current square empty
                            if(x == x2){//reached destination
                                if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
                                    return true;
                                  }
                                //console.log(`friendly fire ${square.id}`);
                                return false; //friendly fire

                              }
                            //console.log(`piece blocking ${square.id}`);
                            return false; //piece in the way

                          }
                        x = x+reflectX;
                    }
                    if(!(game[y1][x].getColor() == this.getColor())){
                      return true;
                    }
                    return false;
                  }
                else{//moving vertically
                    if(ydiff < 0){
                      reflectY = -1;
                    }

                    var y = y1+reflectY;
                    while(y != y2){ //before you reach your move
                      //console.log(`${x1}, ${y} ${game[y][x1].id}`);
                        var square = game[y][x1];
                        if(!(square.id == "Empty")){ //is the current square empty
                          //console.log('detected piece');
                            if(y == y2){//reached destination
                                if(!(square.getColor() == this.getColor())){ //if destination square contains an enemy piece
                                    return true;
                                  }
                                //console.log(`friendly fire ${square.id}`);
                                return false; //friendly fire

                              }
                            //console.log(`piece in way ${square.id}`);
                            return false; //piece in the way
                          }
                        y = y+reflectY;
                      }
                    if(!(game[y][x1].getColor() == this.getColor())){
                      return true;
                    }
                    return false;

                }
              }
            else{//off the board
                return false;
              }
          }
          else if(ydiff != 0){ //
              if(Math.abs((xdiff)/(ydiff)) == 1){//moves like bishop
                //console.log('moves like a bishop');
                  if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){

                      //console.log('607');
                      var reflectX = 1;
                      var reflectY = 1
                      if (xdiff < 0){
                          reflectX = -1;
                      }
                      if (ydiff < 0){
                        reflectY = -1;
                      }

                      var x = x1+reflectX;
                      var y = y1 + reflectY;
                      while(x != x2){
                          //console.log(`${x}, ${y}`);
                          var square = game[y][x];
                          if(!(square.id == "Empty")){
                              //console.log('623');
                              if(x == x2){
                                  if(!(square.getColor() == this.getColor())){
                                      //console.log('good to go!');
                                      return true;
                                  }
                                  //console.log(`friendly fire ${square.id}`);
                                  return false;
                              }
                              //console.log(`piece in way ${square.id}`);
                              return false;
                          }
                          //console.log('hello');
                          x = x + reflectX;
                          y = y + reflectY;
                          //console.log(`(${x},${y})`);
                      }
                      //console.log(`${game[y][x].id}`);
                      if(!(game[y][x].getColor() == this.getColor())){
                        //.log('good to go');
                        return true;
                      }
                      //.log('friendly fire');
                      return false;



                  }
                  else{
                    //console.log('off the board');
                      return false;
                  }
              }
              else{
                //console.log('doesnt move like bishop')
                  return false;
              }
          }else{ //if it doesnt move like a bishop or rook
            //console.log('doesnt move like rook or bishop');
              return false;
          }

        }
}


class King extends Piece{
    constructor(color,name,location,moved){
        super(color,name,location);
        this.moved = moved;
        this.justCastled = false;
        this.inCheck = false;

        if(color === 'white'){
          this.url = "http://174.129.83.34:80/images/Chess_klt60.png"
          this.id = "e1k"
        }else{
          this.url = "http://174.129.83.34:80/images/Chess_kdt60.png"
          this.id = "e8k"
        }
      }
    deepCopy(){
      var copy = new King(this.color,this.name,this.location,this.moved);
      copy.id = this.id;
      copy.justCastled = this.justCastled;
      copy.inCheck = this.inCheck;
      copy.pieceLoc = this.pieceLoc;
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
        //console.log(`xdiff = ${xdiff} ydiff = ${ydiff}`);
        if(((xdiff)*(xdiff) + (ydiff)*(ydiff) <=2) && !(xdiff==0 && ydiff==0)){
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
        else if((xdiff == 2 || xdiff == -2) && ydiff == 0){
          //check for castling
          if(this.moved == true){
            return false;
          }
          if(this.inCheck == true){
            return false;
          }
          var reflectX = 1;
          if(xdiff < 0){
            reflectX = -1;
          }
          if(this.getColor() == "white"){
            if(reflectX == -1){
              if(!(game[0][7].name == "rook" && game[0][7].moved == false)){
                return false;
              }
            }else{
              if(!(game[7][7].name == "rook" && game[7][7].moved == false)){
                return false;
              }
            }
          }else{
            if(reflectX == -1){
              if(!(game[0][0].name == "rook" && game[0][0].moved == false)){
                return false;
              }
            }else{
              if(!(game[0][7].name == "rook" && game[0][7].moved == false)){
                return false;
              }
            }
          }


          var x = x1 + reflectX;
          var y = 7;
          if(this.color == "black"){
            y = 0;
          }
          while(x != x2){
            if(game[y][x].name != "empty"){
              //console.log('piece in the way');
              return false;
            }
            x = x + reflectX;
          }
          this.justCastled = true;
          //set pieces king to true as well
          return true;
        }
        else{
            //console.log('not even close to a king move');
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

class Game{//    Game.move([piece, x, y])      #move is defined as move = [piece, x, y]
    constructor(time,p1name, p2name){

        this.p1 = new Player(p1name, time);
        this.p2 = new Player(p2name, time);

        this.color = Math.floor(Math.random() * 2);
        this.turn = 'null';

        this.p1.color = "white";
        this.p2.color = "black";
        this.turn = "white";

        this.previousPassant = new Empty("null", "empty", [-1,-1]);
        this.pawnPromotions = [false, false, false, false, false]; //0 = pawn 1 = rook 2 = knight 3 = bishop 4 = queen
        this.promotions = [];
        /**
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
        **/


        this.game = this.initializeGame();    //   game[][]
    }
    getPlayer(color){
        //console.log(`this.p1.color == ${this.p1.color}`)
        if(this.p1.color == color){
            return this.p1;
          }else{
            return this.p2;
          }

      }

    returnOpposingPieces(color){
        if(color == this.p1.color){
            return this.p2.pieces;
          }
        return this.p1.pieces;
      }
    setPiece(_piece){
      if(this.p1.color == _piece.color){
        this.p1.pieces[_piece.pieceLoc] = _piece.deepCopy();
      }else{
        this.p2.pieces[_piece.pieceLoc] = _piece.deepCopy();
      }
    }
    getKing(color){
        if(color == this.p1.color){
          return this.p1.pieces[12];
        }else{
          return this.p2.pieces[12];
        }

    }




    selfCheck(move){ //check if a move puts yourself in check
        var xy = move[0].getCoords();
        var color = move[0].getColor();
        var x0 = xy[0];
        var y0 = xy[1];
        var x1 = move[1];
        var y1 = move[2];
        //console.log(`(${x1}, ${y1})`);
        var temp0 = this.game[y0][x0].deepCopy();
        var temp1 = this.game[y1][x1].deepCopy();
        if(temp1.name != "empty"){ //why is this not permanently setting the queens removed quality
          //console.log(`removing ${temp1.name} at tempLoc = ${temp1.pieceLoc}`);
          if(temp1.color == this.p1.color){
            this.p1.pieces[temp1.pieceLoc].removed = true;
          }else{
            this.p2.pieces[temp1.pieceLoc].removed = true;
          }
        }

        console.log(`${this.p1.pieces[temp1.pieceLoc].removed}`);


        //console.log(`knight in selfCheck ${this.game[3][3].id} temp id = ${temp1.id} `);
        this.game[y1][x1] = this.game[y0][x0].deepCopy();
        //console.log(`knight in selfCheck ${this.game[3][3].id} `);
        this.game[y1][x1].location = [x1, y1];
        //castling goes here

          //console.log('king rook or pawn');
          //handle king, castle, and pawn "moved" updates here
          //console.log(`${this.game[y1][x1].name} ${this.game[y1][x1].justCastled}`);
        var tempRook;

        var tempPawn;

        if(this.game[y1][x1].name == "king" && this.game[y1][x1].justCastled == true){

          //console.log('king justCastled true');
          this.setPiece(this.game[y1][x1]);
          var tempKing;
          var rookCords;
          if(move[0].getColor() == "white"){
            if(x1-x0 < 0){
              //console.log(`xdiff < 0 white `);
              rookCords = [3,7];
              tempRook = this.game[7][0].deepCopy();
              this.game[7][3] = this.game[7][0].deepCopy();
              this.game[7][3].location = [3,7];
              if(this.p1.color == color){
                this.p1.pieces[tempRook.pieceLoc].location = rookCords;
              }else{
                this.p2.pieces[tempRook.pieceLoc].location = rookCords;
              }


              this.game[7][0] = new Empty("null", "empty", [0,7]);

            }else{
              //console.log(`xdiff > 0 white`);
              rookCords = [5,7];
              tempRook = this.game[7][7].deepCopy();
              //console.log('h');
              this.game[7][5] = this.game[7][7].deepCopy();
              //console.log('h');
              this.game[7][5].location = [5,7];
              //console.log('h');

              //console.log('h');
              this.game[7][7] = new Empty("null", "empty", [7,7]);
              //console.log('h');
              rookCords = [5,7];
              if(this.p1.color == color){
                this.p1.pieces[tempRook.pieceLoc].location = rookCords;
              }else{
                this.p2.pieces[tempRook.pieceLoc].location = rookCords;
              }

              //console.log('h');
            }
          }else{
            if(x1-x0 < 0){
              //console.log(`xdiff < 0 black `);
              tempRook = this.game[0][0].deepCopy();
              this.game[0][3] = this.game[0][0].deepCopy();
              this.game[0][3].location = [3,0];

              this.game[0][0] = new Empty("null", "empty", [0,0]);
              rookCords = [3,0];
              if(this.p1.color == color){
                this.p1.pieces[tempRook.pieceLoc].location = rookCords;
              }else{
                this.p2.pieces[tempRook.pieceLoc].location = rookCords;
              }
            }else{
              //console.log(`xdiff > 0 black `);
              tempRook = this.game[0][7].deepCopy();
              tempRook;
              this.game[0][5] = this.game[0][7].deepCopy();
              this.game[0][5].location = [5,0];

              this.game[0][7] = new Empty("null", "empty", [7,0]);
              rookCords = [5,0];
              if(this.p1.color == color){
                this.p1.pieces[tempRook.pieceLoc].location = rookCords;
              }else{
                this.p2.pieces[tempRook.pieceLoc].location = rookCords;
              }
            }
          }

        }

        if(move[0].name == "pawn" && move[0].takePassant == true){
          //set up for removal of the opposing pawn and also set
          //.log(`takepassant = true`);
          tempPawn = this.game[y0][x1].deepCopy();
          this.game[y0][x1] = new Empty("null", "empty", [x1, y0]);
        }
        //console.log('838');

        //console.log(`knight in selfCheck ${this.game[3][3].id} `);
        this.game[y0][x0] = new Empty("null", "empty",[x0,y0]);
        var kingcoords;
        if(temp0.name == "king"){
          kingcoords = [this.game[y1][x1].location[0], this.game[y1][x1].location[1]];
        }else{
          var king = this.getKing(color);
          kingcoords = [king.getCoords()[0], king.getCoords()[1]];
        }
        ////console.log(`knight in selfCheck ${this.game[3][3].id} `);
        var opposites = this.returnOpposingPieces(color);

        //console.log(`opposite pieces length = ${opposites.length}`);
        //console.log(`knight in selfCheck ${this.game[3][3].id} `);

        //.log(`tempLoc = ${temp1.pieceLoc} removed = ${this.p1.pieces[temp1.pieceLoc].removed} name = ${this.p1.pieces[temp1.pieceLoc].name}`);
        //.log(`removed = ${opposites[temp1.pieceLoc].removed}`);
        var r;
        for(r = 0; r < opposites.length; r++){
          //console.log('');

          var element = opposites[r];
          //.log(`r = ${r} color = ${element.color}`);
          //.log(`${element.name}.removed = ${element.removed} at (${element.location[0]}, ${element.location[1]})`);

          if(element.removed == true){
            continue;
          }
          //.log(`testing ${element.id} at ${element.location} for check on king at ${kingcoords[0]}, ${kingcoords[1]}`);
          if(element.legalPattern(kingcoords, this.game)){
            //.log(`${element.id} can check the king`);
            //undo move
            this.game[y0][x0] = temp0.deepCopy();
            //console.log(`knight in selfCheck ${this.game[3][3].id} `);
            this.game[y1][x1] = temp1.deepCopy();
            //console.log(`knight in selfCheck ${this.game[3][3].id} `);
            if(this.getKing(color).justCastled == true){
              //console.log('857');
              this.game[tempRook.location[1]][tempRook.location[0]] = tempRook;
              if(this.p1.color == color){
                this.p1.pieces[tempRook.pieceLoc] = tempRook.deepCopy();
                this.p1.pieces[12].justCastled = false;
              }else{
                this.p2.pieces[tempRook.pieceLoc] = tempRook.deepCopy();
                this.p2.pieces[12].justCastled = false;
              }
              this.game[rookCords[1]][rookCords[0]] = new Empty("null", "empty", [rookCords[0], rookCords[1]]);

            }

            if(move[0].takePassant == true){
              this.game[y0][x1] = tempPawn.deepCopy();
              this.game[y0][x1].passantable = false;//handle undoing
              this.game[y0][x0].takePassant = false;//handle undoing

            }
            //.log(`${element.name} can attack king on (${kingcoords[0]},${kingcoords[1]})`);
            if(temp1.color == this.p1.color){
              //.log('changing removed to false p1');
              this.p1.pieces[temp1.pieceLoc].removed = false;
            }else{
              //.log('changing removed to false p2');
              this.p2.pieces[temp1.pieceLoc].removed = false;
            }
            this.game[y1][x1].removed = false;
            return true;
          }
        }

        //undo move
        this.game[y0][x0] = temp0.deepCopy();
        //console.log(`knight in selfCheck ${this.game[3][3].id} `);
        this.game[y1][x1] = temp1.deepCopy();
        //console.log(`knight in selfCheck ${this.game[3][3].id} `);
        //console.log('879');
        //console.log(`7,7 before rook switch-back ${this.game[7][7].id}`);

        if(this.getKing(color).justCastled == true){
          //console.log('881');
          //console.log(`(${tempRook.location[1]}, ${tempRook.location[0]})`);
          this.game[tempRook.location[1]][tempRook.location[0]] = tempRook;
          if(this.p1.color == color){
            this.p1.pieces[tempRook.pieceLoc] = tempRook.deepCopy();
          }else{
            this.p2.pieces[tempRook.pieceLoc] = tempRook.deepCopy();
          }
          this.game[rookCords[1]][rookCords[0]] = new Empty("null", "empty", [rookCords[0], rookCords[1]]);
        }

        if(move[0].takePassant == true){
          this.game[y0][x1] = tempPawn.deepCopy();
        }

        //this.game[y1][x1].removed = true; //do we need this?
        return false;

    }
    isLegal(move){
        //move is defined as move = [piece, x, y]
        //console.log(`in islegal`);
        var x2 = move[1];
        var y2 = move[2];


        if(move[0].legalPattern([x2,y2], this.game)){//can the piece move in that pattern?
          //console.log(`knight after legalPattern ${this.game[3][3].id} `);
            //console.log(`7,7 after legal pattern ${this.game[7][7].id}`);
            //console.log(`passantable: ${this.game[move[0].location[1]][move[0].location[0]].passantable}`)
            if(!this.selfCheck(move)){ //does the move not put you in check?
              //console.log(`knight after selfcheck ${this.game[3][3].id}`);
              //console.log(`7,7 after selfCheck ${this.game[7][7].id}`);
                return true;
              }
            else{//move puts you in check
                //.log('move puts you in check!')
                return false;
              }
          }
        //.log('illegal patern');
        return false;

      }

    movePiece(move){


        if(this.isLegal(move)){
            //console.log(`0,0 ${this.game[0][0].id} 0,7 ${this.game[0][7].id} 7,0 ${this.game[7][0].id} 7,7 ${this.game[7][7].id}`);
            var x0 = move[0].getCoords()[0];
            var y0 = move[0].getCoords()[1];
            //console.log(`${move[0].id} at (${x0}, ${y0})`);
            var x1 = move[1];
            var y1 = move[2];
            var color = move[0].color;
            //console.log(`(${x1}, ${y1})`);
            //console.log(`${this.game[y1][x1].id}`)
            //console.log(`true legal patern king coord (${this.game[0][4].location[0]}, ${this.game[0][4].location[1]}) `);
            if(this.previousPassant.name != "empty" && (this.previousPassant.color == color)){
              //.log('previousPassant not empty. changing passantable back to false');
              this.game[this.previousPassant.location[1]][this.previousPassant.location[0]].passantable = false;
              this.previousPassant = new Empty("null", "empty", [-1, -1]);
            }
            var moveholder = [false,"Empty"];

            if(this.game[y1][x1].id != "Empty"){
              moveholder[0] = true;
              moveholder[1] = this.game[y1][x1].id;
              this.game[y1][x1].removed = true;
              this.setPiece(this.game[y1][x1]);
            }

            if(this.game[y0][x0].name == "pawn" && this.game[y0][x0].takePassant == true){
              //.log('takepassant in movepiece');
              moveholder[0] = true;
              moveholder[1] = this.game[y0][x1].id;
              this.game[y0][x1].removed = true;
              this.game[y0][x0].takePassant = false;
              this.setPiece(this.game[y0][x1])
            }



            this.game[y1][x1] = move[0].deepCopy();
            //console.log(`${this.game[y1][x1].id} post piece-switch at (${this.game[y1][x1].location[0]}, ${this.game[y1][x1].location[1]})`);
            //need to update player pieces
            this.game[y1][x1].location = [x1,y1];
            this.game[y1][x1].id = move[0].id;
            //console.log(`${this.game[y1][x1].id} post loc-switch at (${this.game[y1][x1].location[0]}, ${this.game[y1][x1].location[1]})`);
            //console.log(`true legal patern king coord (${this.game[0][4].location[0]}, ${this.game[0][4].location[1]}) `);
            if(move[0].getColor() == 'white'){
              //console.log(`move[0] id = ${move[0].id}`);
              this.p1.pieces[move[0].pieceLoc].location = [x1,y1];

            }else{
              //console.log(`move[0] id = ${move[0].id} move[0] pieceloc = ${move[0].pieceLoc}`);
              this.p2.pieces[move[0].pieceLoc].location = [x1,y1];
            }

            if(this.game[y1][x1].name == "king" || this.game[y1][x1].name == "rook" || this.game[y1][x1].name == "pawn"){//special piece moves
              //console.log('king rook or pawn');
              //handle king, castle, and pawn "moved" updates here
              this.game[y1][x1].moved = true;
              this.setPiece(this.game[y1][x1])
              //***need to find a way to also set castle move to true
              //***set player piece to true as well

              //console.log(`${this.game[y1][x1].name} ${this.game[y1][x1].justCastled}`);
              if(this.game[y1][x1].name == "king" && this.game[y1][x1].justCastled == true){
                //.log('king justCastled true');

                if(move[0].getColor() == "white"){
                  if(x1-x0 < 0){
                    this.game[7][3] = this.game[7][0].deepCopy();
                    this.game[7][3].location = [3,7];
                    moveholder.push(this.game[7][3]);
                    this.game[7][0] = new Empty("null", "empty", [0,7]);
                  }else{
                    this.game[7][5] = this.game[7][7].deepCopy(); //empty by the time it gets here
                    this.game[7][5].location = [5,7];
                    moveholder.push(this.game[7][5]);
                    this.game[7][7] = new Empty("null", "empty", [7,7]);
                  }
                }else{
                  if(x1-x0 < 0){
                    this.game[0][3] = this.game[0][0].deepCopy();
                    this.game[0][3].location = [3,0];
                    moveholder.push(this.game[0][3]);
                    this.game[0][0] = new Empty("null", "empty", [0,0]);
                  }else{
                    this.game[0][5] = this.game[0][7].deepCopy();
                    this.game[0][5].location = [5,0];
                    moveholder.push(this.game[0][5])
                    this.game[0][7] = new Empty("null", "empty", [7,0]);
                  }
                }
                this.game[y1][x1].justCastled = false;
                this.setPiece(this.game[y1][x1]);
                //set pieces king to false as well

              }
            }


            //console.log(`${move[0].id} at (${move[0].getCoords()[0]}, ${move[0].getCoords()[1]})`);
            //console.log(`true legal patern king coord (${this.game[0][4].location[0]}, ${this.game[0][4].location[1]}) `);
            this.game[y0][x0] = new Empty("null","empty",[x0,y0]);
            //console.log(`true legal patern king coord (${this.game[0][4].location[0]}, ${this.game[0][4].location[1]}) `);


            //console.log(`${this.game[y1][x1].id} post-empty at (${this.game[y1][x1].location[0]}, ${this.game[y1][x1].location[1]})`);
            //console.log('____________________________________________');
            /*
            console.log(`${this.p1.pieces[10].id} at (${this.p1.pieces[10].location[0]}, ${this.p2.pieces[10].location[1]})`);
            console.log(`${this.p1.pieces[13].id} at (${this.p1.pieces[13].location[0]}, ${this.p2.pieces[13].location[1]})`);
            console.log(`${this.p2.pieces[2].id} at (${this.p2.pieces[2].location[0]}, ${this.p2.pieces[2].location[1]})`);
            console.log(`${this.p2.pieces[5].id} at (${this.p2.pieces[5].location[0]}, ${this.p2.pieces[5].location[1]})`);
            */



            if(this.game[move[2]][move[1]].name == "king"){
              //set opposing players inCheck to true
              this.game[move[2]][move[1]].inCheck = true;
              if(this.p1.color == move[0].color){
                this.p2.inCheck = true;

              }else{
                this.p1.inCheck = true;
              }

            }

            if(this.getPlayer(move[0].color).inCheck == true){//if u successfully made it out of a check
              this.game[move[2]][move[1]].incheck = false;
              if(this.p1.color == move[0].color){
                this.p1.inCheck = false;
              }else{
                this.p2.inCheck = false;
              }
            }

            moveholder.push(this.game[y1][x1]);

            if(move[0].color == "white"){
              this.turn = "black";
            }else{
              this.turn = "white";
            }

            if(move[0].name == "pawn" && (Math.abs(y1 - y0) == 2)){
              this.previousPassant = this.game[y1][x1].deepCopy();
            }

            return moveholder;
          }
        else{
            //do not make the move, return control to color that attempted to make the move
            //console.log('illegal move');

            //console.log(`${this.game[y1][x1].id} movetest at (${this.game[y1][x1].location[0]}, ${this.game[y1][x1].location[1]})`);
            //console.log('____________________________________________');
            /*
            console.log(`${this.p1.pieces[10].id} at (${this.p1.pieces[10].location[0]}, ${this.p2.pieces[10].location[1]})`);
            console.log(`${this.p1.pieces[13].id} at (${this.p1.pieces[13].location[0]}, ${this.p2.piec//es[13].location[1]})`);
            console.log(`${this.p2.pieces[2].id} at (${this.p2.pieces[2].location[0]}, ${this.p2.pieces[2].location[1]})`);
            console.log(`${this.p2.pieces[5].id} at (${this.p2.pieces[5].location[0]}, ${this.p2.pieces[5].location[1]})`);
            */
            return [false, "Empty",move[0]];
        }
      }


      generateMoves(){
        var ar = this.getPlayer(this.turn).pieces;
        var moves = [];
        var m;
        for(m = 0; m < ar.length; m++){
          var element = ar[m];
          //console.log(`element = ${element.name}`);
          var i;
          var j;
          //onsole.log(`legal moves for ${element.id} ${element.name}`);
          for(i = 0; i < 8; i++){
            for(j = 0; j < 8; j++){
              //console.log(`checking`);
              var legal = false;
              if(element.legalPattern([i,j], this.game) == true){
                //console.log(`${element.name} (${element.location[0]},${element.location[1]}) => (${i},${j})`);
                if(this.selfCheck([element, i, j]) == false){
                  //console.log(`${element.name} can move to (${i}, ${j})`);
                  legal = true;
                }
              }
              var y0 = element.location[1];
              var x0 = element.location[0];
              if(this.game[y0][x0].name == "pawn" && this.game[y0][x0].takePassant == true){
                //.log('undoing takepassant in checkmate');
                this.game[y0][x0].takePassant = false;
                this.game[y0][i].passantable = false;
                //need to add setPiece here?
              }

              if(this.game[y0][x0].name == "king" && this.game[y0][x0].justCastled == true){
                this.game[y1][x1].justCastled = false;
                this.setPiece(this.game[y1][x1]);
              }

              if(legal){
                moves.push([element, i, j]);
              }
            }
          }
        }

        return moves;
      }

    printGame(){
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < 8; j++){
                //console.log(this.game[i][j].getName() + " ");
            }
            //console.log("\n")
        }
    }



    printPieces(){
        var i;
        //console.log('___________________________');
        for(i = 0; i < 16; i++){
            //.log(this.p1.pieces[i].id + " ")
            //.log(this.p2.pieces[i].id + "\n")
          }
        //console.log('___________________________');
    }

    reverse(){
      var majors = this.p2.pieces.slice(0,8);
      var pawns = this.p2.pieces.slice(8,16);
      var j;
      for(j=0; j < 8; j++){
        pawns.push(majors[j]);
      }
      this.p2.pieces = pawns;
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
        //console.log(`in checkmate`)
        var k = this.getKing(this.turn);
        var kingCoords = k.location
        //console.log(`${this.turn} ${k.color} ${k.name} ${kingCoords}`);
        var inCheck = false;
        var q;
        var arr = this.returnOpposingPieces(k.color);
        var attackers = [];
        //console.log(`${arr.length}`);

        for(q = 0; q < arr.length; q++){

          var element = arr[q];
          //console.log(`${element.name} ${element.color} ${element.location}`);
          if(element.legalPattern(kingCoords, this.game) == true){
            //console.log(`${element.name} checking the king`);
            inCheck = true;
            //attackers.push(element);
          }
        }
        if(inCheck == false){
          return false;
        }


        var ar = this.getPlayer(k.color).pieces;
        var m;
        for(m = 0; m < ar.length; m++){
          var element = ar[m];
          //console.log(`element = ${element.name}`);
          var i;
          var j;
          //console.log(`legal moves for ${element.id} ${element.name}`);
          for(i = 0; i < 8; i++){
            for(j = 0; j < 8; j++){
              //console.log(`checking`);
              if(element.legalPattern([i,j], this.game) == true){ // for eery
                //console.log(`${element.name} (${element.location[0]},${element.location[1]}) => (${i},${j})`);
                if(this.selfCheck([element, i, j]) == false){
                  //console.log(`${element.name} can move to (${i}, ${j})`);
                  return false;
                }
              }
              var y0 = element.location[1];
              var x0 = element.location[0];
              if(this.game[y0][x0].name == "pawn" && this.game[y0][x0].takePassant == true){
                //console.log('undoing takepassant in checkmate');
                this.game[y0][x0].takePassant = false;
                this.game[y0][i].passantable = false;
                //need to add setPiece here?
              }

              if(this.game[y0][x0].name == "king" && this.game[y0][x0].justCastled == true){
                this.game[y1][x1].justCastled = false;
                this.setPiece(this.game[y1][x1]);
              }
            }
          }
        }

        return true;

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