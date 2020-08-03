
function ws(xjs, yjs, n){
  var i;
  var crossSum =0;
  var xSum = 0;
  var ySum = 0;
  var xSquareSum=0;
  for(i = 0; i < n; i++){
    crossSum += xjs[i]*yjs[i];
    xSum += xjs[i];
    ySum += yjs[i];
    xSquareSum += Math.pow(xjs[i], 2);
  }
  return [(n*(crossSum) - xSum*ySum)/(n*xSquareSum - Math.pow(xSum, 2)), ySum, xSum];
}

function w0(xjs, yjs, ws, n){
    var wsHolder = ws(xjs, yjs, n);
    var ws = ws[0];
    var ySum = ws[1];
    var xSum = ws[2];
    return (ySum - ws*xSum)/n;
}

function wn(){
  return;
}

function h(sum){
  return 1/(1+Math.exp(-1*(sum)));
}

function batchGraDesc(data){
    /*
    this algorithm follows the gradient downhill until it reaches a mininum in parameter space.
    not necessarily guaranteed to be global min unless loss function is quadratic
    */
    var x1s = data[0];
    var x2s = data[1];
    var ys = data[2];
    var ws = [.5,.5];
    var loss;
    var iteration = 0;
    var a = 1000/(1000+iteration);
    var proportion = 0;
    var iterationArr = [];
    for(var k = 20; k < 222250000; k*=5){
      while(iteration < k){ // for each training example [x1, x2, y]

        //console.log(`iteration%4 = ${iteration%4}`);
        //console.log(`carry = ${ys[iteration%4]} h(wc*x) = ${(ws[0]*x1s[iteration%4]+ws[1]*x2s[iteration%4])}`);
        var w1 = ws[0];
        var w2 = ws[1];
        var x1 = x1s[iteration%4];
        var x2 = x2s[iteration%4];
        var sum = (w1*x1+w2*x2);
        //console.log(`ys[iteration%4] = ${ys[iteration%4]} h(sum) = ${h(sum)}`);
        if(ys[iteration%4] - h(sum) < 0.01){
          proportion += 1;
        }
        //console.log(`sum = ${ys[iteration%4]} h(ws*x) = ${(w2[0]*x1s[iteration%4]+w2[1]*x2s[iteration%4])}`);


        ws[0] =  ws[0] - a*(ys[iteration%4]- h(sum))*(h(sum))*(1-h(sum))*x1;
        ws[1] =  ws[1] - a*(ys[iteration%4]- h(sum))*(h(sum))*(1-h(sum))*x2;

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
      ws = [.5,.5];
  }


    return iterationArr;

}



function stochGradDesc(){
  return;
}


class PerceptronNetwork{
  constructor(data, dimensions){

  }
}

class SigmoidNetwork{
  constructor(data, dimensions){

  }

}


class Agent{
  constructor(){

  }

}

var iterationArr = batchGraDesc([[0,0,1,1],[0,1,0,1],[0,1,1,0]]); //learning carry node of adder function
for(var p = 0; p < iterationArr.length; p++){
  console.log(`iterations: ${iterationArr[p][0]} proportion correct: ${iterationArr[p][1]}`);
}


/*
var ctx = document.createElement("canvas");
ctx.width = "400";
ctx.height = "400";
var Chart = require('node_modules/chart.js/dist/chart.js');
*/
