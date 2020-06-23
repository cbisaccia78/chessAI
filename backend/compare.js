if((ydiff == 0) != (xdiff == 0)){ //moves like rook
    if(x2 > -1 && x2 < 8 && y2 > -1 && y2 < 8){
        //for each square on path to move, is there an empty square or do you run into a piece? if not good to go
        if(xdiff != 0){ //moving horizontally
            if(xdiff > 0){ //moving to the right
                var x1plus = x1+1;
                while(x1plus <= x2){ //before you reach your move
                    square = game[y1][x1plus]
                    if(!isinstance(square,Empty)){ //is the current square empty
                        if(x1plus == x2){//reached destination
                            if(square.getColor() != this.getColor()){ //if destination square contains an enemy piece
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
                    if not isinstance(square,Empty): //is the current square empty
                        if x1minus == x2://reached destination
                            if square.getColor() != this.getColor(): //if destination square contains an enemy piece
                                return true;
                            return false; //friendly fire
                        return false; //piece in the way
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
                    if(!isinstance(square,Empty){ //is the current square empty
                        if(y1plus == y2){//reached destination
                            if(square.getColor() != this.getColor()){ //if destination square contains an enemy piece
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
                    if(!isinstance(square,Empty)){ //is the current square empty
                        if(y1minus == y2){//reached destination
                            if(square.getColor() != this.getColor()){ //if destination square contains an enemy piece
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
