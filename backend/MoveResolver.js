
function w1(xjs, yjs, n){
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

function w0(xjs, yjs, w1, n){
    var w1Holder = w1(xjs, yjs, n);
    var w1 = w1[0];
    var ySum = w1[1];
    var xSum = w1[2];
    return (ySum - w1*xSum)/n;
}

function wn(){
  return;
}

function batchGraDesc(data){
    /*
    this algorithm follows the gradient downhill until it reaches a mininum in parameter space.
    not necessarily guaranteed to be global min unless loss function is quadratic
    */
    var x1s = data[0];
    var x2s = data[1];
    var y3s = data[2];
    var y4s = data[3];
    var w3 = [.5,.5];
    var w4 = [.5,.5];
    var loss;
    var iteration = 0;
    var a = 1000/(1000+iteration);
    var proportion1 = 0;
    var proportion2 = 0;

    while(iteration < 1000){ // for each training example [x1i, x2i, y3i, y4i]
      var i;
      if(y3s[iteration%3] == + ((w3[0]*x1s[iteration%3]+w3[1]*x2s[iteration%3]) >= 0)){
        proportion1 += 1;
      }
      if(y4s[iteration%3] == + ((w4[0]*x1s[iteration%3]+w4[1]*x2s[iteration%3]) >= 0)){
        proportion2 += 1;
      }
      for(i = 0; i < 2; i++){
        w3[i] =  w3[i] - a*(y3s[iteration%3]- +((w3[0]*x1s[iteration%3]+w3[1]*x2s[iteration%3]) >= 0));
        w4[i] = w4[i] - a*(y4s[iteration%3]- +((w4[0]*x1s[iteration%3]+w4[1]*x2s[iteration%3]) >= 0));
      }
    iteration += 1;
    a = 1000/(1000+iteration);
    console.log(`w3[0] == ${w3[0]} w3[1] == ${w3[1]} w4[0] == ${w4[0]} w4[1] == ${w4[0]}`);
    }
    proportion1/= iteration;
    proportion2/= iteration;
    ;

    return [w3, w4, proportion1, proportion2];

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

var holder = batchGraDesc([[0,0,1,1],[0,1,0,1],[0,0,0,1],[0,1,1,0]]); //with adder function
var w3 = holder[0];
var w4 = holder[1];
var prop1 = holder[2];
var prop2 = holder[3];
console.log(`proportion1 : ${prop1} proportion2 : ${prop2}`);
