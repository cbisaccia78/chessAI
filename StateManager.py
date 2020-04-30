from random import randint
from enum import Enum
#import MoveResolver
#import Interface




class Player:
    def __init__(self, name,  time):
        self.name = name
        self.time = time
        self.color = "null" #initially set to null before random operator
        self.pieces = []
        self.check = False

    def getName(self):
        return self.name

    def setColor(self,color):
        self.color = color

    def getColor(self):
        return self.color

    def getTime(self):
        return self.time

    def inCheck(self):
        return self.check

class Piece:
    def __init__(self, color, name, location):
        """empty = 0 pawn = 1 knight = 2 bishop = 3 rook = 4 queen = 5 king = 6 """
        self.color = color
        self.name = name
        self.location = location  #  (x,y)    location[0] = x, location[1] = y

    def getName(self):
        if self.name == 'king' or self.name == 'knight':
            return self.name[0:2]
        else:
            return self.name[0:1]

    def getColor(self):
        return self.color


    def getCoords(self):
        return self.location



#def mT(textmove):
    #textmove of the form "knd4" for example





class Empty(Piece):
    def __init__(self,color,name,location):
        super().__init__(color,name,location)
    def movesTo():
        return


class Knight(Piece):
    def __init__(self,color,name,location):
        super().__init__(color,name,location)
    def moves():
        x = self.location[0]
        y = self.location[1]
        possibles = ()
        """
        if x > 1: #x-2 > -1
            if y > 0:
                possibles.append((x-2, y-1))
            if y < 7:
                possibles.append((x-2, y+1))
        if x-1 > -1
        """
    def legalPattern(xy):
        x1 = self.location[0]
        y1 = self.location[1]
        x2 = xy[0]
        y2 = xy[1]
        if ((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)) == 5:
            if x2 > -1 and x2 < 8 and y2 > -1 and y2 < 8:
                return True
            else:
                return False
        else:
            return False


class Bishop(Piece):
    def __init__(self,color,name,location):
        super().__init__(color,name,location)
    def moves():
        return

    def legalPattern(xy):
        x1 = self.location[0]
        y1 = self.location[1]
        x2 = xy[0]
        y2 = xy[1]

        if y2-y1 == 0:
            return False

        if x2-x1 == 0:
            return False

        if abs((x2-x1)/(y2-y1)) == 1:
            if x2 > -1 and x2 < 8 and y2 > -1 and y2 < 8:
                return True
            else:
                return False
        else:
            return False



class Pawn(Piece):
    def __init__(self,color,name,location):
        super().__init__(color,name,location)
        self.moved = False
    def moves():
        return

    def legalPattern(xy):
        x1 = self.location[0]
        y1 = self.location[1]
        x2 = xy[0]
        y2 = xy[1]

        if y2-y1 == 1:
             ##considers a diagonal attack to be a a legal move
              ##therefore another part of the program must check that
              ##an enemy piece does indeed exist there
            if (x2-x1 == 1) or (x2 - x1 == 0):
                if (x2 > -1) and (x2 < 8) and (y2 < 8):
                    return True
                else:
                    return False

            else:
                return False
        elif y2-y1 == 2:
            if self.moved:
                return False
            if x2-x1 == 0:
                if y2 < 8:
                    return True
                else:
                    return False
            else:
                return False


        else:
            return False


class Rook(Piece):
    def __init__(self,color,name,location):
        super().__init__(color,name,ocation)
    def moves():
        return

    def legalPattern(xy):
        x1 = self.location[0]
        y1 = self.location[1]
        x2 = xy[0]
        y2 = xy[1]

        if (y2 - y1 == 0) != (x2-x1 == 0): #quick xor
            if x2 > -1 and x2 < 8 and y2 > -1 and y2 < 8:
                return True
            else:
                return False
        else:
            return False


class Queen(Piece):
    def __init__(self,color,name,location):
        super().__init__(color,name,location)
    def moves():
        return

    def legalPattern(xy):

        x1 = self.location[0]
        y1 = self.location[1]
        x2 = xy[0]
        y2 = xy[1]

        if (y2-y1 == 0) != (x2-x1 == 0): #moves like rook
            if x2 > -1 and x2 < 8 and y2 > -1 and y2 < 8:
                return True
        elif y2-y1 != 0: #then we know x2-x1 !=0
            if abs((x2-x1)/(y2-y1)) == 1:
                if x2 > -1 and x2 < 8 and y2 > -1 and y2 < 8:
                    return True
                else:
                    return False
            else:
                return False
        else: #if it doesnt move like a rook or bishop
            return False


class King(Piece):
    def __init__(self,color,name,location):
        super().__init__(color,name,location)
    def moves():
        return

    def legalPattern(xy):
        x1 = self.location[0]
        y1 = self.location[1]
        x2 = xy[0]
        y2 = xy[1]

        if (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) == 2:
            if x2 > -1 and x2 < 8 and y2 > -1 and y2 < 8:
                return True
            else:
                return False
        else:
            return False



def color(i):
    if(i == 0 or i == 1):
        return "white"
    else:
        return "black"

class Game:                               #    Game.move([piece, x, y])      #move is defined as move = [piece, x, y]
    def __init__(self,time,p1name, p2name):

        self.p1 = Player(p1name, time)
        self.p2 = Player(p2name, time)

        self.color = randint(0,1)
        if self.color == 0:
            self.p1.setColor("white")
            self.p2.setColor("black")
        else:
            self.p1.setColor("black")
            self.p2.setColor("white")

        self.game = self.initializeGame()    #   game[][]


    def check(self, move, p): #check if a move puts yourself in check
        if p.inCheck():#does the move take you out of check. may be more efficient
            return
        else:
            xy = move[0].getCoords()
            x0 = xy[0]
            y0 = xy[1]
            x1 = move[1]
            y1 = move[2]
            temp = self.game[x0][y0]
            self.game[x1][y1] = temp
            self.game[x0][y0] = Empty("null", "empty",(x0,y0))
        return


    def isLegal(self,move):
        #move is defined as move = [piece, x, y]
        piece = move[0]
        x2 = move[1]
        y2 = move[2]
        square = self.game[x2][y2]
        if piece.legalPattern((x2, y2)):#can the piece move in that pattern?
                if not isinstance(square, Empty): #is the square nonempty
                    if square.getColor() != piece.getColor(): #is it an enemy piece?
                        if not self.check(move): #does the move not put you in check?
                            return True
                        else:#move puts you in check
                            return False
                    else: #friendly fire!
                        return False
                else:
                    if not self.check(move):
                        return True
                    else:#move puts you in check
                        return False
        else:#piece cant move in that pattern
            return False


    def movePiece(self,move):
        if(isLegal(move)):
            return
        else:
            #do not make the move, return control to color that attempted to make the move
            return

    def printGame(self):
        for i in range(0,8):
            for j in range(0, 8):
                print(self.game[i][j].getName() + " ")
            print("\n")

    def initializeGame(self):
        game = []
        """empty = 0 pawn = 1 knight = 2 bishop = 3 rook = 4 queen = 5 king = 6 """
        for i in range(0,8):
            row = []
            if i == 0 or i == 7:
                row.append(Rook(color(i), "rook", (i,0)))
                row.append(Knight(color(i), "knight",(i,1)))
                row.append(Bishop(color(i), "bishop",(i,2)))
                if i == 0:
                    row.append(Queen(color(i), "queen",(i,3)))
                    row.append(King(color(i), "king",(i,4)))
                else:
                    row.append(King(color(i), "king",(i,3)))
                    row.append(Queen(color(i), "queen",(i,4)))
                row.append(Bishop(color(i), "bishop",(i,5)))
                row.append(Knight(color(i), "knight",(i,6)))
                row.append(Rook(color(i), "rook",(i,7)))
            elif i == 1 or i == 6:
                for j in range(0,8):
                    row.append(Pawn(color(i), "pawn",(i,j)))
            else:
                for k in range(0,8):
                    row.append(Empty("null", "empty",(i,k)))
            game.append(row)

        return game




    def state(self):
        #outside will call this function to get access to state
        return gameState #where gamestate is an array of relevant game info

    def checkMate(self):
        return False




chessGame = Game(5, "cole", "computer")
chessGame.printGame()
