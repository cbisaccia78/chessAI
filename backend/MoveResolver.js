

var statemanager = require('./StateManager.js');

function h(sum){
  return 1/(1+Math.exp(-1*(sum)));
}


class Node {
  constructor(in, inSum, outs, nodeOuts){
    this.in = in;
    this.inSum = inSum;
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
    for(i = 0; i < inputs.length; i++){
      inputLayer.push(new Node(Null, Null, inputs[i], Null));
    }
    this.neuralLayers.push(inputLayer);
    for(i = 0; i < this.hL.length; i++){ //for each hidden layer
      var hiddenLayer = [];
      for(var p = 0; p < this.hL[i]; p++){//for each node in the hidden layer
        var in = []; //calculate the input nodes
        var inSum = 0; //calculate the input sum
        for(var j = 0; j < this.neuralLayers[i].length; j++){//for each node in the previous layer
          in.push(this.neuralLayers[i][j]); //make each node in the current layer fully connected to the previous layer nodes
          inSum += .5*this.neuralLayers[i][j].out;
        }

        var node = new Node(in, inSum, h(inSum));
        hiddenLayer.push(node);
      }
      this.neuralLayers.push(hiddenLayer);
    }
    var outLayer = [];
    for(i = 0; i < outputs.length; i++){
      var outNode;
      var out = 0;
      var in = [];
      var inSum = 0;
      var lengthOfLastHiddenLayer = this.neuralLayers[this.neuralLayers.length].length;
      for(var p = 0; p < lengthOfLastHiddenLayer; p++){//for each node in the last hidden layer
        in.push(this.neuralLayers[this.neuralLayers.length][p]);
        inSum += .5*this.neuralLayers[this.neuralLayers.length][p].out;
      }
      outNode = new Node(in, inSum, h(inSum));
      outLayer.push(outNode);
    }
    this.neuralLayers.push(outLayer);

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
    for(var l = 0; l < neuralLayers.length-1; l++){
      var wl = [];
      for(var m = 0; m < neuralLayers[l].length; m++){
        wl.push(.5);
      }
      ws.push(wl);
    }
    //at this point we've set arbitrary weights in parameter space for each layer in the net

    //compute the delta value for the output units using the observed error with deltak = g'(ink)*(y-h)
    var iteration = 0;
    var alpha = 1000/(1000+iteration);
    while(iteration < 2000000){
      for(var q = 0; q < outputs.length; q++){//start with output later, applying wj,k = wj,k + alpha*deltak*aj for each j in the previous layer
        var ink = this.neuralLayers[hL.length][q].inSum;
        var aj = this.neuralLayers[hL.length][r].out;
        var y = outputs[iteration%outputs.length];
        for(var r = 0; r < this.neuralLayers[hL.length].length; r++){
          ws[ws.length-1][r] += alpha*h(ink)*(1-h(ink))*(outputs[iteration%]-h)*aj;
        }
      }
      var c;
      for(c = hL.length; c >=0; c--){
        var sum = 0;
        var p;
        //calculated ink

        for(p = 0; p < hL[c]; p++){
          sum += w[c][p]*inputs[c][iteration%inputs[c].length]
        }

      }
  }
    //start with output layer, applying wj,k = wj,k+alpha*deltak*aj
    //while not at earliest HIDDEN layer:
    //    propogate the current delta values back to the previuos layer
    //    update the weights between the two layers with the rule:   wi,j = wi,j + alpha*ai*deltaj where deltaj = g'(inj)*sumk(wj,k*deltak)    where deltak = g'(ink)*(y-h)
  }

  tiller(){

  }
}








function stochGradDesc(){
  return;
}

function heuristic(game, move){
  return 1;
}



function getmove(game){
  /*
  var player = game.getPlayer(game.turn);
  var moves = player.generateMoves(game);

  var i;
  var bestHSoFar = 0;
  var bestMoveSoFar;
  for(i = 0; i < moves.length; i++){
    var h = heuristic(game, moves[i])
    if(heuristic(game,moves[i]) > bestSoFar){
      bestSoFar = h;
      bestMoveSoFar = moves[i];
    }
  }

  return bestMoveSoFar;
  */
}



var signet = new SigmoidNet([[0,0,1,1],[0,1,0,1]],[],[0,1,1,0])
var iterationArr = signet.batchGraDesc(); //learning carry node of adder function
for(var p = 0; p < iterationArr.length; p++){
  console.log(`iterations: ${iterationArr[p][0]} proportion correct: ${iterationArr[p][1]}`);
}





/*
var ctx = document.createElement("canvas");
ctx.width = "400";
ctx.height = "400";
var Chart = require('node_modules/chart.js/dist/chart.js');
*/
