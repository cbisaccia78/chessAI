

var statemanager = require('./StateManager.js');

function h(sum){
  return 1/(1+Math.exp(-1*(sum)));
}






function stochGradDesc(){
  return;
}

function pieceConversion(piece){
  if(piece.color == "white"){
    if(piece.name == "pawn"){
      return 1;
    }else if(piece.name == "rook"){
      return 2;
    }else if(piece.name == "knight"){
      return 3;
    }else if(piece.name == "bishop"){
      return 4;
    }else if(piece.name == "queen"){
      return 5;
    }else if(piece.name == "king"){
      return 6;
    }else{
      return 0;
    }
  }else{
    if(piece.name == "pawn"){
      return -1;
    }else if(piece.name == "rook"){
      return -2;
    }else if(piece.name == "knight"){
      return -3;
    }else if(piece.name == "bishop"){
      return -4;
    }else if(piece.name == "queen"){
      return -5;
    }else if(piece.name == "king"){
      return -6;
    }else{
      return 0;
    }
  }

}
function generateBitBoard(game, move){
  var newGame = game.movePieceUpdate(move);//will this change game?
  //console.log(newGame);
  var bitboard = [];
  for(var i = 0; i < 8; i++){
    row = [];
    for(var j = 0; j < 8; j++){
      row.push(pieceConversion(newGame.game[i][j]));
    }
    bitboard.push(row);
  }
  //console.log(bitboard);
  return bitboard
}

function generateInitialBitboard(game){
  //var newGame = game.deepCopy();//will this change game?

  var bitboard = [];
  for(var i = 0; i < 8; i++){
    row = [];
    for(var j = 0; j < 8; j++){
      row.push(pieceConversion(game.game[i][j]));
    }
    bitboard.push(row);
  }
  //console.log(bitboard);
  return bitboard
}

class Node {
  constructor(inN, inSum, out, nodeOuts,name){
    this.in = inN;
    this.inSum = inSum;
    this.name = name
    this.out = out; //values of outputs connecting to each
    this.nodeOuts = nodeOuts; //which nodes does it connect to
  }
}

class Edge{
  constructor(node1, node2, weight){
    this.node1 = node1;
    this.node2 = node2;
    this.weight = weight;
  }
}

function bitToInputNodeOutput(pieceLoc, bit){
  if(pieceLoc == bit){
    return 1;
  }else{
    return 0;
  }
}

class SigmoidNet {
  constructor(inputs, hiddenLayers, outputs){
    this.neuralLayers = [];
    this.inputs = inputs;
    this.outputs = outputs;
    this.hL = hiddenLayers; //hiddenLayters defined as an array of numbers. Number_i represents the number of hidden nodes at layer i.
    this.weights = [];
    this.bitboardSequence = [];//used for learning after the game
    this.initialBitboard = [];
    this.createNet();
  }

  createNet(){
    /*creates a fully connected sigmoid net using the node class defined above (planning for optimal brain damage algo, but also should allow for tilling)
    propagates the weights forward, so that in the backproplearning algo you can avoid this step.
    */
    var game = new statemanager.Game(5, "computer", "computer");
    this.initialBitboard = generateInitialBitboard(game);
    this.bitboardSequence.push(this.initialBitboard);
    //console.log(this.initialBitboard)

    var inputLayer = [];
    for(var i = 0; i < 8; i++){
      for(var j = 0; j < 8; j++){
        for(var p = 0; p < 13; p++){//13 possible pieces including empty piece
          inputLayer.push(new Node(null, null, bitToInputNodeOutput(p-6, this.initialBitboard[i][j]), null, "input"));
        }
      }

    }
    this.neuralLayers.push(inputLayer);
    console.log(this.neuralLayers);
    for(i = 0; i < this.hL.length; i++){ //for each hidden layer
      var hiddenLayer = [];
      for(var p = 0; p < this.hL[i]; p++){//for each node in the hidden layer
        var inN = []; //calculate the input nodes
        var inSum = 0; //calculate the input sum. default 0
        for(var j = 0; j < this.neuralLayers[i].length; j++){//for each node in the previous layer
          inN.push(this.neuralLayers[i][j]); //make each node in the current layer fully connected to the previous layer node
        }

        var node = new Node(inN, inSum, null, null, "hidden");
        hiddenLayer.push(node);
      }
      this.neuralLayers.push(hiddenLayer);
    }
    var outLayer = [];
    for(i = 0; i < this.outputs.length; i++){
      var outNode;
      var inN = [];
      var inSum = 0;  //default
      var lengthOfLastHiddenLayer = this.neuralLayers[this.neuralLayers.length-1].length;
      for(var p = 0; p < lengthOfLastHiddenLayer; p++){//for each node in the last hidden layer
        inN.push(this.neuralLayers[this.neuralLayers.length-1][p]);
      }
      outNode = new Node(inN, inSum, null, null, "output");
      outLayer.push(outNode);
    }
    this.neuralLayers.push(outLayer);
    console.log(`${this.neuralLayers.length}`);
    for(var i = 0; i < this.neuralLayers.length; i++){
      for(var j = 0; j < this.neuralLayers[i].length; j++){
        console.log(this.neuralLayers[i][j].out);
      }
    }

  }



  forwardProp(bitboard){

    // Propagate the inputs forward to compute the outputs //unnecessary for now because input node outputs are calculated at creation of net

    for(var i = 0; i < this.neuralLayers[0].length; i++){//for each row of node clusters
      for(var j = 0; j < this.neuralLayers[0][i].length; i++){//for each node cluster in a row i
        for(var k = 0; k < 13; k++){//for each node in a cluster j
          //console.log(`bitboard[${i}][${j}] = ${bitboard[i][j]}`)
          this.neuralLayers[0][i].out = bitToInputNodeOutput(k-6, this.bitboard[i][j]);
          console.log(this.neuralLayers[0][i]);
        }
      }

    }


    if(this.weights.length == 0){
      //initialize weights

      for(var i = 1; i < this.neuralLayers.length; i++){
        var layerIWeights = [];
        for(var j = 0; j < this.neuralLayers[i].length; j++){//for each hidden node in the layer
          var nodeJWeights = [];
          for(var k = 0; k < this.neuralLayers[i-1].length;k++){//for each node connected to this hidden node j
            //create a weight that connects k to j
            nodeJWeights.push(.5);
          }
          layerIWeights.push(nodeJWeights);
        }
        this.weights.push(layerIWeights);
      }

    }

    for(var l = 1; l < this.neuralLayers.length;l++){//for each hidden layer starting at the first
      for(var j = 0; j < this.neuralLayers[l].length; j++){//for each node j in the hidden layer
        var inj = 0;
        for(var i = 0; i < this.neuralLayers[l-1].length; i++){//for each node i in the previous layer do
          inj+=this.weights[l-1][j][i]*this.neuralLayers[l-1][i].out;
        }
        this.neuralLayers[l][j].inSum = inj;
        this.neuralLayers[l][j].out = h(inj);
      }
    }
    console.log(this.neuralLayers[this.neuralLayers.length-1]);

  }


  backProp(){


    //inputs: examples, a set of examples, each with input vector x and output vector y
            //network , a multilayer network with L layers, weights wi,j , activation function g
    var examples = [];
    for(var i = 0; i < this.inputs.length; i++){
      examples.push([inputs[i], outputs[i]]);
    }
    //local variables: Δ, a vector of errors, indexed by network node
    var delta = [];

    for(var i = 0; i < this.neuralLayers.length-1; i++){
      var delLayer = [];
      for(var j = 0; j < this.neuralLayers[i].length; j++){
        delLayer.push(0)
      }
      delta.push(delLayer);
    }
    // [layer1Weights,..., layerNWeights] where layeriWeights = [node1Weights,.., nodeNWweights]
                      //weights[1][2][3]:   the weight of the 4th node in the 1st hidden layer on the 3rd node in the second hidden layer  [1] means from 1->2
    for(var i = 1; i < this.neuralLayers.length; i++){
      var layerIWeights = [];
      for(var j = 0; j < this.neuralLayers[i].length; j++){//for each hidden node in the layer
        var nodeJWeights = [];
        for(var k = 0; k < this.neuralLayers[i-1].length;k++){//for each node connected to this hidden node j
          //create a weight that connects k to j
          nodeJWeights.push(.5);
        }
        layerIWeights.push(nodeJWeights);
      }
      this.weights.push(layerIWeights);
    }

    console.log(this.weights);

    var iteration = 0;
    var alpha = 1000/(1000+iteration);
    var error = [];
    while(iteration < 200000){
      //for each example (x, y) in examples do
      for(var e = 0; e < this.inputs.length; e++){

        // Propagate the inputs forward to compute the outputs //
        for(var i = 0; i < this.neuralLayers[0].length; i++){//for each node i in the input layer do ai←xi
          this.neuralLayers[0][i].out = examples[e][0][i];
        }
        for(var l = 1; l < this.neuralLayers.length;l++){//for each hidden layer starting at the first
          for(var j = 0; j < this.neuralLayers[l].length; j++){//for each node j in the hidden layer
            var inj = 0;
            for(var i = 0; i < this.neuralLayers[l-1].length; i++){//for each node i in the previous layer do
              inj+=this.weights[l-1][j][i]*this.neuralLayers[l-1][i].out;
            }
            this.neuralLayers[l][j].inSum = inj;
            this.neuralLayers[l][j].out = h(inj);
          }
        }

        //Propagate deltas backward from output layer to input layer /
        for(var j = 0; j < this.outputs.length; j++){//for each node in the output layer
          var inj = this.neuralLayers[this.neuralLayers.length-1][j].inSum;
          var yj = examples[e][1];
          var aj = this.neuralLayers[this.neuralLayers.length-1][j].out;
          error.push(Math.abs(yj-aj));
          delta[delta.length-1][j] = h(inj)*(1-h(inj))*(yj - aj); // the size of the delta array will be 1 less than the whole neural net size, because the input layer doesnt have a delta
          }
        var nll = this.neuralLayers.length;
        var lhl = nll-2;//last hidden layer
        //now we can do the deltajs
        for(var l = lhl; l >= 1; l--){//starting at the last hidden layer calculate the deltajs
          for(var i = 0; i < this.neuralLayers[i].length; i++){//for each node i in layer l
            var sumJwijdelj = 0;
            for(var j = 0; j < this.neuralLayers[l+1].length; j++){//for each node above
                sumJwijdelj += this.weights[l][j][i]*delta[l][j];
            }
            var ini = this.neuralLayers[l][i].inSum;
            delta[l-1][i] = h(ini)*(1-h(ini))*sumJwijdelj; //Δ[j]
          }

        }

        // Update every weight in network using deltas
        for(var l = 0; l < this.neuralLayers.length-1; l++){
          for(var i = 0; i < this.neuralLayers[l].length; i++){
            for(var j = 0; j < this.neuralLayers[l+1].length; j++){
              this.weights[l][j][i] += alpha*this.neuralLayers[l][i].out*delta[l][j];
            }
          }
        }


      }
      iteration += 1;
      alpha = 1000/(1000+iteration);
    }
    for(var i = error.length-200; i < error.length; i++){
      console.log(error[i]);
    }
    //console.log(error[error.length-1]);
    //return network
}


  tiller(){

  }
}

function getmove(game, sigmoidNet){

  var player = game.getPlayer(game.turn);
  var moves = game.generateMoves();

  var i;
  var bestHSoFar = 0;
  var bestMoveSoFar = 0;
  for(i = 0; i < moves.length; i++){
    var gameCopy = game.deepCopy();
    //console.log(gameCopy);
    var bitboard = generateBitBoard(gameCopy, moves[i]);
    //console.log(bitboard);
    //evaluate bitboard
    //if bitboard evaluation > best so far
    //move i = bestmovesofar

  }

  return bestMoveSoFar;

}

/*
var inputs = []; // [[0,0,0,0,0], [0,0,0,0,1], ... , [1, 1, 1, 1, 0], [1, 1, 1, 1, 1]]
var outputss = []; //[0,1,....,0,0,1]
var outputs = [];
for(var i = 0; i < 2; i++){//implement majority function with 5 slots for all 2^5 combinations
  for(var j = 0; j < 2; j++){
    for(var k = 0; k < 2; k++){
      for(var l = 0; l < 2; l++){
        for(var m = 0; m < 2; m++){
            inputs.push([i, j, k, l, m]);
            //console.log(`${[i, j, k, l, m]} `);
            if((i+j+k+l+m) >= 3){
              //console.log(`${1}`);
              outputs.push(1);
            }else{
              //console.log(`${0}`);
              outputs.push(0);
            }
        }
      }
    }
  }
}
*/



//console.log(`${inputs} ${outputs}`);
//outputss.push(outputs);

var signet = new SigmoidNet([[1,1,1]],[5,5],[1]);//try it with 1 hidden layer
signet.forwardProp(signet.initialBitboard);


var game = new statemanager.Game("computer", "computer", 5);
var p = game.getPlayer(game.turn);



var move = getmove(game)


//var moves = game.generateMoves();
//var newGame = game.movePieceUpdate(moves[0]);
/*
for(var i = 0; i < moves.length; i++){

  console.log(moves[i]);
}
*/
