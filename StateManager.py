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

    def getName(self):
        return self.name

    def setColor(self,color):
        self.color = color

    def getColor(self):
        return self.color

    def getTime(self):
        return self.time

class Piece:
    def __init__(self, color, name, value, location):
        """empty = 0 pawn = 1 knight = 2 bishop = 3 rook = 4 queen = 5 king = 6 """
        self.color = color
        self.name = name
        self.value = value
        self.location = location

    def getName(self):
        if self.value == 2 or self.value == 6:
            return self.name[0:2]
        else:
            return self.name[0:1]

    def getColor(self):
        return self.color

    def getValue(self):
        return self.value

    def getCoords(self):
        return self.location





class Empty(Piece):
    def __init__(self,color,name,value,location):
        super().__init__(color,name,value,location)
    def movesTo():
        return


class Knight(Piece):
    def __init__(self,color,name,value,location):
        super().__init__(color,name,value,location)
    def moves():
        x = self.location[0]
        y = self.location[1]
        possibles = ()
        if x > 1: #x-2 > -1
            if y > 0:
                possibles.append((x-2, y-1))
            if y < 7:
                possibles.append((x-2, y+1))
        if x-1 > -1

    def knightMove(move):
        x1 = self.location[0]
        y1 = self.location[1]
        x2 = move[1]
        y2 = move[2]
        if ((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)) == 5:
            if x2 > -1:
                if x2 < 8:
                    if y2 > -1:
                        if y2 < 8:
                            return True
                        else:
                            return False
                    else:
                        return False
                else:
                    return False
            else:
                return False
        else:
            return False


class Bishop(Piece):
    def __init__(self,color,name,value,location):
        super().__init__(color,name,value,location)
    def moves():
        return

    def bishopMove(move):
        x1 = self.location[0]
        y1 = self.location[1]
        x2 = move[1]
        y2 = move[2]

        if y2-y1 == 0:
            return False

        if x2-x1 == 0:
            return False

        if abs((x2-x1)/(y2-y1)) == 1:
            if x2 > -1:
                if x2 < 8:
                    if y2 > -1:
                        if y2 < 8:
                            return True
                        else:
                            return False
                    else:
                        return False
                else:
                    return False
            else:
                return False
        else:
            return False
        return


class Pawn(Piece):
    def __init__(self,color,name,value,location):
        super().__init__(color,name,value,location)
        self.moved = False
    def moves():
        return

    def pawnMove(move):
        x1 = self.location[0]
        y1 = self.location[1]
        x2 = move[1]
        y2 = move[2]

        if y2-y1 == 1:
            if x2-x1 == 1 or x2 - x1 == 0: ##considers a diagonal attack to be a a legal move
                return True                ##therefore another part of the program must check that
                                           ##an enemy piece does indeed exist there
            else:
                return False:
        elif y2-y1 == 2:
            if self.moved:
                return False
            if x2-x1 == 0:
                return True
            else:
                return False


        else:
            return False


class Rook(Piece):
    def __init__(self,color,name,value,location):
        super().__init__(color,name,value,location)
    def moves():
        return

    def rookMove(move):
        return

class Queen(Piece):
    def __init__(self,color,name,value,location):
        super().__init__(color,name,value,location)
    def moves():
        return

    def queenMove(move):
        return


class King(Piece):
    def __init__(self,color,name,value,location):
        super().__init__(color,name,value,location)
    def moves():
        return

    def kingMove(move):
        return



def color(i):
    if(i == 0 or i == 1):
        return "white"
    else:
        return "black"

class Game:
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

        self.game = self.initializeGame()




    def isLegal(self,move):
        #move is defined as move = [piece, x, y]
        #can the piece move in that pattern?
        #if not does the move run into a friendly piece
        #if not does the move leave you in check
        #if not then you're good to go


        return

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
                row.append(Rook(color(i), "rook", 4, (i,0)))
                row.append(Knight(color(i), "knight", 2,(i,1)))
                row.append(Bishop(color(i), "bishop", 3,(i,2)))
                if i == 0:
                    row.append(Queen(color(i), "queen", 5,(i,3)))
                    row.append(King(color(i), "king", 6,(i,4)))
                else:
                    row.append(King(color(i), "king", 6,(i,3)))
                    row.append(Queen(color(i), "queen", 5,(i,4)))
                row.append(Bishop(color(i), "bishop", 3,(i,5)))
                row.append(Knight(color(i), "knight", 2,(i,6)))
                row.append(Rook(color(i), "rook", 4,(i,7)))
            elif i == 1 or i == 6:
                for j in range(0,8):
                    row.append(Pawn(color(i), "pawn", 1,(i,j)))
            else:
                for k in range(0,8):
                    row.append(Empty("null", "empty", 0,(i,k)))
            game.append(row)

        return game




    def state():
        #outside will call this function to get access to state
        return gameState




chessGame = Game(5, "cole", "computer")
chessGame.printGame()
