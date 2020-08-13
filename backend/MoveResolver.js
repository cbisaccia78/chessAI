

var statemanager = require('./StateManager.js');

function h(sum){
  return 1/(1+Math.exp(-1*(sum)));
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

class SigmoidNet {
  constructor(inputs, hiddenLayers, outputs){
    this.neuralLayers = [];
    this.inputs = inputs;
    this.outputs = outputs;
    this.hL = hiddenLayers; //hiddenLayters defined as an array of numbers. Number_i represents the number of hidden nodes at layer i.
    this.createNet();
  }

  createNet(){
    /*creates a fully connected sigmoid net using the node class defined above (planning for optimal brain damage algo, but also should allow for tilling)
    propagates the weights forward, so that in the backproplearning algo you can avoid this step.
    */

    var i;
    var inputLayer = [];
    for(i = 0; i < inputs[0].length; i++){
      var nodeiInputs = [];
      for(var p = 0; p < inputs.length; p++){
        nodeiInputs.push(inputs[p][i]);
      }
      inputLayer.push(new Node(null, null,nodeiInputs, null, "input"));//set the outputs of the input nodes to be equal to the inputs

    }
    this.neuralLayers.push(inputLayer);
    console.log(`${this.hL.length}`);
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


  batchGraDesc(){
    /*
    this algorithm follows the gradient downhill until it reaches a mininum in parameter space.
    not necessarily guaranteed to be global min unless loss function is quadratic
    */
    var inputs = this.inputs;
    var outputs = this.outputs;

    /*
    var x1s = data[0]; //inputs
    var x2s = data[1]; //inputs
    var ys = data[2]; //outputs
    */
    var ws = [];
    var i;
    for(i = 0; i < inputs.length; i++){
      ws.push(.5); //arbitrary start vector in w-space
    }
    var loss;
    var iteration = 0;
    var a = 1000/(1000+iteration);
    var proportion = 0;
    var iterationArr = [];
    var modulo = inputs[0].length;
    for(var k = 20; k < 222250000; k*=5){
      while(iteration < k){ // for each training example [x1, x2, y]

        //console.log(`iteration%4 = ${iteration%4}`);
        //console.log(`carry = ${ys[iteration%4]} h(wc*x) = ${(ws[0]*x1s[iteration%4]+ws[1]*x2s[iteration%4])}`);
        var sum = 0;
        var i;
        for(i = 0; i < inputs.length; i++){
          sum += ws[i]*inputs[i][iteration%modulo]
        }
        /*
        var w1 = ws[0];
        var w2 = ws[1];
        var x1 = x1s[iteration%4];
        var x2 = x2s[iteration%4];
        var sum = (w1*x1+w2*x2);
        */
        //console.log(`ys[iteration%4] = ${ys[iteration%4]} h(sum) = ${h(sum)}`);
        if(outputs[iteration%modulo] - h(sum) < 0.01){
          proportion += 1;
        }
        //console.log(`sum = ${ys[iteration%4]} h(ws*x) = ${(w2[0]*x1s[iteration%4]+w2[1]*x2s[iteration%4])}`);

        for(i = 0; i < inputs.length; i++){
          ws[i] = ws[i] - a*(outputs[iteration%modulo] - h(sum))*(h(sum))*(1-h(sum))*inputs[i][iteration%modulo]
        }
        /*
        ws[0] =  ws[0] - a*(ys[iteration%4]- h(sum))*(h(sum))*(1-h(sum))*x1;
        ws[1] =  ws[1] - a*(ys[iteration%4]- h(sum))*(h(sum))*(1-h(sum))*x2;
        */

        iteration += 1;
        a = 1000/(1000+iteration);
      //console.log(`ws[0] == ${ws[0]} ws[1] == ${ws[1]} w2[0] == ${w2[0]} w2[1] == ${w2[0]}`);
      //console.log(`iteration: ${iteration} proportion1: ${proportion1/iteration} proportion2: ${proportion2/iteration}`);

      }

      console.log(`proportionraw: ${proportion}`)
      proportion/= iteration;
      iterationArr.push([iteration, proportion])
      proportion = 0;
      iteration = 0;
      console.log(`${ws}`);
      a = 1000/(1000+iteration);
      ws = [];
      for(i = 0; i < inputs.length; i++){
        ws.push(.5); //arbitrary start vector in w-space
      }
    }


      return iterationArr;

  }

  backPropLearning(){ //assumes a static neural net structure (could be incorperated into tilling algo)

    var inputs = this.inputs;
    var outputs = this.outputs;
    var hL = this.hL; //hidden layers
    var iL = inputs.length;
    var ws = [];
    for(var l = 0; l < this.neuralLayers.length-1; l++){ //evaluates to 2
      var wl = [];
      for(var m = 0; m < this.neuralLayers[l].length; m++){ //first layer is 5, second is 2
        wl.push(.5);
      }
      //console.log(wl);
      ws.push(wl);
      //console.log(ws);
    }
    //at this point we've set arbitrary weights in parameter space for each layer in the net

    console.log(ws[0][0]);
    console.log('entering while loop')
    //compute the delta value for the output units using the observed error with deltak = g'(ink)*(y-h)
    var iteration = 0;
    var alpha = 1000/(1000+iteration);
    var error = [];
    while(iteration < 2000000){
      //firstwe must propogate input forward.
      //walk through the net layer by layer, setting inputsum and outputs
      //first handle the input layer
      //console.log('set up first hidden layer');
      for(var t = 0; t < this.neuralLayers[1].length; t++){//for each hidden node in the hidden layer
        var inSum = 0;
        for(var q = 0; q < this.neuralLayers[0].length; q++){//for each node in the previous layer
          //console.log(`this.neuralLayers[0][q].out = ${this.neuralLayers[0][q].out[iteration%outputs[0].length]}`);
          inSum += this.neuralLayers[0][q].out[iteration%outputs[0].length]*ws[0][q]; //as you can see, out is a vector of inputs for the input layer
          //console.log(`q = ${q} ws[0][q] = ${ws[0][q]} iteration = ${iteration} 205`);
          //console.log(`insum = ${inSum} ws[0][q] = ${ws[0][q]}`);
        }
        this.neuralLayers[1][t].inSum = inSum;
        this.neuralLayers[1][t].out = h(inSum);//but out is a single scalar for the hidden layers and output layer
        //console.log(`insum = ${inSum} h(inSum = ${this.neuralLayers[1][t].out}) iteration = ${iteration} 210`);
      }

      //at this point we can move on to the second+ hidden layer(if need be) and the output layer
      //console.log('set up second hiden layer + output');
      var z;
      for(z = 2; z< this.neuralLayers.length; z++){//for each layer
        for(var t = 0; t < this.neuralLayers[z].length; t++){//for each node in the hidden layer
          var inSum = 0;
          for(var q = 0; q < this.neuralLayers[z-1].length; q++){//for each node in the previous layer
            //console.log(`this.neuralLayers[z-1][q].out = ${this.neuralLayers[z-1][q].out}`)
            inSum += (this.neuralLayers[z-1][q].out)*ws[z-1][q];
          }
          this.neuralLayers[z][t].inSum = inSum;
          this.neuralLayers[z][t].out = h(inSum);
          //console.log(`insum = ${inSum} h(inSum = ${this.neuralLayers[z][t].out} iteration = ${iteration} 225)`);
          //console.log(`insum = ${inSum} z = ${z} t = ${t} this.neuralLayers[z][t].out = ${this.neuralLayers[z][t].out}`);
        }

      }

      //at this point, for a particular example iteration%, we have propogated the inputs forward. now we may back propagate.
      //while not at earliest HIDDEN layer:
      //    propogate the current delta values back to the previuos layer

      var deltaks = [];
      var ol = this.neuralLayers.length-1;
      var oll= this.neuralLayers[ol].length;
      //console.log('entering backprop');
      for(var p = 0; p < oll; p++){//start with output layer, applying wj,k = wj,k+alpha*deltak*aj
        var ink = this.neuralLayers[ol][p].inSum; //should this insum value be changed here, or during the forward propagation?
        var ak = this.neuralLayers[ol][p].out;
        //console.log(`ak = ${ak}`);
        var y = outputs[p][iteration%outputs[p].length];
        //console.log(`y = ${y}`);
        error.push(Math.abs(y-ak));
        var deltak = h(ink)*(1-h(ink))*(y-ak);
        //console.log(`deltak = ${deltak}`);
        //deltaks.push(deltak);
        for(var q = 0; q < this.neuralLayers[ol-1].length; q++){
          var aj = this.neuralLayers[ol-1][q].out;
          //console.log(`aj = ${aj}`);
          ws[ol-1][q] += alpha*aj*deltak;
        }
        //console.log(ws);

        var deltajs = [];
          //    update the weights between the two layers with the rule:   wi,j = wi,j + alpha*ai*deltaj where deltaj = g'(inj)*sumk(wi,j*deltak)    where deltak = g'(ink)*(y-h)
        //console.log('entering backprop');
        for(var j = this.neuralLayers.length-2; j >= 1; j--){//for each j layer update the weights between the i and j nodes
          for(var q = 0; q < this.neuralLayers[j].length; q++){//for each node in the j layer

            var inj = this.neuralLayers[j][q].inSum; //should this insum value be changed here, or during the forward propagation?

            var gPinJ = h(inj)*(1-h(inj));
            //console.log(`inj = ${inj} gPinJ = ${gPinJ}`);

            //    update the weights between the two layers with the rule:   wi,j = wi,j + alpha*ai*deltaj where deltaj = g'(inj)*sumk(wj,k*deltak)    where deltak = g'(ink)*(y-h)
            var sumk = 0;
            for(var o = 0; o < oll; o++){
              sumk += ws[j][o]*deltak;
            }

            var deltaj = gPinJ*sumk;
            //console.log(`deltaj = ${deltaj}`);

            for(var r = 0; r < this.neuralLayers[j-1].length; r++){//for each node in the i layer
              var ai;
              if(j-1 == 0){
                ai = this.neuralLayers[j-1][r].out[iteration%outputs[0].length];
              }else{
                ai = this.neuralLayers[j-1][r].out;
              }
              //console.log(`ai = ${ai}`)
              ws[j-1][r] += alpha*deltaj*ai; //changing the weights at the last hidden layer before the outputs (wj,k)
            }
            //deltajs.push(deltak);
            //go to next output node
          }
          //at this point delta ks are ready to be backpropagated=
        }
        //console.log('going to the next output node');
        //console.log(ws);

      }
      //console.log('restarting backprop');

      iteration += 1;

  }

  for(var i = 0; i < error.length; i++){
    console.log(error[i]);
  }

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
    var weights = [];// [layer1Weights,..., layerNWeights] where layeriWeights = [node1Weights,.., nodeNWweights]
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
      weights.push(layerIWeights);
    }

    console.log(weights);

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
              inj+=weights[l-1][j][i]*this.neuralLayers[l-1][i].out;
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
                sumJwijdelj += weights[l][j][i]*delta[l][j];
            }
            var ini = this.neuralLayers[l][i].inSum;
            delta[l-1][i] = h(ini)*(1-h(ini))*sumJwijdelj; //Δ[j]
          }

        }

        // Update every weight in network using deltas
        for(var l = 0; l < this.neuralLayers.length-1; l++){
          for(var i = 0; i < this.neuralLayers[l].length; i++){
            for(var j = 0; j < this.neuralLayers[l+1].length; j++){
              weights[l][j][i] += alpha*this.neuralLayers[l][i].out*delta[l][j];
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



function stochGradDesc(){
  return;
}


function generateBitBoard(game, move){
  var newGame = game.movePieceUpdate(move);
  var bitboard = [];
  for(var i = 0; i < 8; i++){
    for(var j = 0; j < 8; j++){
      bitboard[j][i] = newGame.game[j][i].name
    }
  }
  return bitboard
}



function getmove(game){

  var player = game.getPlayer(game.turn);
  var moves = player.generateMoves(game);

  var i;
  var bestHSoFar = 0;
  var bestMoveSoFar;
  for(i = 0; i < moves.length; i++){
    var gameCopy = game.deepCopy();
    var bitboard = generateBitBoard(gameCopy, moves[i]);
    //evaluate bitboard
    //if bitboard evaluation > best so far
    //move i = bestmovesofar
    continue;

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

//generate bitboard
var bitboard = [];
for(var i = 0; i < 8; i++){
  for(var j = 0; j < 8; j++){
    if(j == 0){

    }else if(j == 1){

    }
  }
}

//console.log(`${inputs} ${outputs}`);
//outputss.push(outputs);

//var signet = new SigmoidNet(inputs,[5,5],outputss);//try it with 1 hidden layer
//signet.backProp();


var game = new statemanager.Game("computer", "computer", 5);
var p = game.getPlayer(game.turn);


var move = getmove(game)


//var moves = game.generateMoves();
/*
for(var i = 0; i < moves.length; i++){

  console.log(moves[i]);
}
*/
