So the serialization of the game is as follows.

Each move is serialized as an object containing an input output pair:

`{input:[0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],output:[0,0,0,0,0,0,0,0,1]}`

Where input is an array representing the input to the Neural net. 0 is an opponent occupied square, 0.5 is empty, and 1 is a square occupied by the computer

Output is an array representing the output from the neural net. 1 is if the player chooses to place his next X or O on the spot.

The grid is serialized from left to right, so index 0-2 is the first row, 3-5 is the second, 6-8 is the last row

Finally, the list is separated by commas.

Every iteration of learning, the NN is fed this file, so the format must be kept.
