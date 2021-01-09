# chessAI


This is a brief description of the underlying components of the chess application and how they interface with each other:

1. StateManager.js

This contains the underlying data structures and algorithms to implement the chess game. The game class is exported to the MoveResolver and the frontEnd for manipulation. 


2. MoveResolver.js

This contains the neural network that generates moves for each player based on the represented board input. The input to this neural net is a "bitboard", which is essentially an 8x8 matrix with elements contained in the set {-6, -5, ..., 5, 6} which represent black and white pieces respectively. The output is another bitboard which represents the state of the game following the most optimal move. 
