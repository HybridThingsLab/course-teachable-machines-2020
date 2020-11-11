// neural network classification on Webcam Images with poseNet

// labels (feel free to add more)
let labels = [
  "A",
  "B",
  "C"
];

// webcam
let video;
let flippedVideo;

// poseNet
let poseNet;
let poses = [];

// custom neural network
let brain; // neural network is the brain
const optionsNeuralNetwork = {
  inputs: 51, // keypoints confidence & x,y position
  outputs: labels.length, // number of labels declared
  debug: true, // shows visualization during training
  learningReate: 0.2, // try different values here > goal: as little loss as possible at the end
  task: 'classification'
}
const modelInfo = {
  model: 'data/model.json',
  metadata: 'data/model_meta.json',
  weights: 'data/model.weights.bin',
};
const customDataFile = "data/data.json";

const optionsTraining = {
  batchSize: 24, // try different values here > goal: as little loss as possible at the end
  epochs: 70 // try different values here > goal: as little loss as possible at the end
}

let trainingFinished = false;
let optimizedInputData = []; // set in draw()
let confidences = [];
let mostPredictedClass = "";
let valueMostPredictedClass = 0.0;
let dataCounter = [
  0,
  0,
  0
];

function setup() {

  // canvas
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas');

  // generate gui
  generateGui(labels);

  // init webcam
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // init poseNet Model, see https://github.com/tensorflow/tfjs-models/tree/master/posenet
  // flip horizontal und just pose of one person
  poseNet = ml5.poseNet(video, {
    flipHorizontal: true,
    detectionType: 'single'
  }, modelReady);
  select('#output').html('... loading model');

  // detect if new pose detected and call 'gotResultModel'
  poseNet.on('pose', gotResultsModel);

  // init brain
  brain = ml5.neuralNetwork(optionsNeuralNetwork);


}

function draw() {

  // clear background
  background(0);

  // show video (flipped)
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // show results of poseNet
  drawKeypoints();
  drawSkeleton();

  // show confidences classification
  if (confidences.length > 0) {

    // loop through labels
    for (let i = 0; i < labels.length; i++) {
      const x = 20;
      const y = i * 24 + 20;
      noStroke();
      fill(0, 255, 0);
      textAlign(LEFT, TOP);
      textSize(16);
      text(labels[i], x, y);
      // just if there is a value
      if (confidences[i] != null) {
        text(confidences[i].toFixed(3), x + 24, y);
      }
    }

    // show class with highest value prediction
    textAlign(CENTER, CENTER);
    textSize(56);
    text(mostPredictedClass + ": " + valueMostPredictedClass.toFixed(3), width / 2, height / 2);

  }


}


// model ready
function modelReady() {
  select('#output').html('model loaded');
}

// results of current model (p.ex. PoseNet, handpose, facemesh...)
function gotResultsModel(result) {
  poses = result;
  // just update input data if new input data available
  if (poses.length > 0) {
    inputData = poses[0].pose.keypoints.map(p => [p.score, p.position.x, p.position.y]);
    //console.log(inputData);
  }

  poses = result;
  // just update optimized input data if new input data available
  if (poses.length > 0) {

    // clear input data
    optimizedInputData.length = 0;

    // loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      // for each pose detected, loop through all the keypoints
      let pose = poses[i].pose;
      for (let j = 0; j < pose.keypoints.length; j++) {
        // a keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.keypoints[j];
        optimizedInputData.push(keypoint.score);
        optimizedInputData.push(keypoint.position.x);
        optimizedInputData.push(keypoint.position.y);
      }
    }

    console.log(optimizedInputData.length);
    // console.log(optimizedInputData);
  }

}

///////////////////////////
// Visualization PoseNet //
///////////////////////////

// draw ellipses over the detected keypoints
function drawKeypoints() {
  // loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // for each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // a keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(0, 255, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// draw the skeletons
function drawSkeleton() {
  // loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // for every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(0, 255, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

////////////////////////////////
// NEURAL NETWORK STARTS HERE //
////////////////////////////////


// Add the current input data to the classifier
function addData(label) {

  // add an example (= optimized input data) with a label to the classifier
  if (optimizedInputData.length > 0) {

    // add data
    brain.addData(optimizedInputData, [label]);

    // update counts
    updateCounts(label);

  }

}

// train model neural network
function trainModel() {
  // ml5 will normalize data to a range between 0 and 1 for you.
  brain.normalizeData();
  // Train the model
  // Epochs: one cycle through all the training data
  brain.train(optionsTraining, whileTraining, finishedTraining);
  // output
  select('#output').html('training started...');
}

function whileTraining(epoch, loss) {
  // output
  select('#output').html('training started...' + ' epoch: ' + epoch + ' loss: ' + loss.loss);
}

// when model is trained
function finishedTraining() {
  // output
  select('#output').html('training finished');
  // training state
  trainingFinished = true;
}

// predict the current mouse position
function classify() {

  if (optimizedInputData.length > 0) {

    // just if not training in progress
    if (trainingFinished == true) {
      // classification
      brain.classify(optimizedInputData, gotResults);
    }
  }
}

// Show the results
function gotResults(err, results) {

  // Display any error
  if (err) {
    console.error(err);
  }

  // label with highest confidence (= first label in results)
  mostPredictedClass = results[0].label;
  valueMostPredictedClass = results[0].confidence;

  // loop trough results
  // console.log(results);
  for (let i = 0; i < results.length; i++) {
    // loop trough labels
    for (let j = 0; j < labels.length; j++) {
      // check if same label
      if (results[i].label == labels[j]) {
        let confidence = results[i].confidence;
        confidences[j] = confidence;
      }
    }
  };

  // classify again
  classify();

}
// Update the example count for each label	
function updateCounts(label) {

  for (let i = 0; i < labels.length; i++) {
    // check if same label
    if (label == labels[i]) {
      dataCounter[i]++;
      select('#counter_' + label).html(dataCounter[i] || 0);
    }
  }

}

// load data
function loadCustomData() {

  // output
  select('#output').html('... loading custom data');

  // load
  brain.loadData(customDataFile, customDataLoaded);
}

function customDataLoaded() {

  // output
  select('#output').html('custom data loaded, training needed!');

  // visualize data loaded
  let data = brain.neuralNetworkData.data.raw;
  // console.log(data);

  // update counts
  for (let i = 0; i < data.length; i++) {
    let currentLabel = data[i].ys[0];
    updateCounts(currentLabel);
  }

}

// save data
function saveCustomData() {
  brain.saveData("data");
}

// load model
function loadCustomModel() {

  // output
  select('#output').html('... loading custom model');

  // load model
  brain.load(modelInfo, customModelReady);
}

function customModelReady() {
  // output
  select('#output').html('custom model loaded, no training needed!');
  // training state
  trainingFinished = true; // model already trained
}

// save model
function saveCustomModel() {
  brain.save("model");
}


/////////////////
// generate gui //
//////////////////
function generateGui(lc) {

  // main gui
  const gui_train_predict = createDiv().parent('gui');
  gui_train_predict.class("gui-container");

  // train model
  const trainButton = createButton("Train Model").parent(gui_train_predict);
  trainButton.class("button highlight-button");
  trainButton.mousePressed(function () {
    trainModel();
  });

  // classify
  const classifyButton = createButton("Classify").parent(gui_train_predict);
  classifyButton.class("button");
  classifyButton.mousePressed(function () {
    classify();
  });

  // gui classes

  for (let i = 0; i < lc.length; i++) {

    // container buttons class
    const gui_class = createDiv().parent('gui');

    // add example button
    const add_data_button = createButton(lc[i]).parent(gui_class);
    add_data_button.html("Add Data to Class " + lc[i]);
    add_data_button.class("button");
    add_data_button.mousePressed(function () {
      // add data immediately
      addData(lc[i]);
    });


    // counter examples
    const counter_examples = createSpan('0').parent(gui_class);
    counter_examples.class("text-gui");
    counter_examples.id("counter_" + lc[i]);

  }

  // main gui
  const gui_load_save = createDiv().parent('gui');
  gui_load_save.class("gui-container");

  // load data
  const loadDataButton = createButton("Load Data").parent(gui_load_save);
  loadDataButton.class("button");
  loadDataButton.mousePressed(function () {
    loadCustomData();
  });
  // save data
  const saveDataButton = createButton("Save Data").parent(gui_load_save);
  saveDataButton.class("button");
  saveDataButton.mousePressed(function () {
    saveCustomData();
  });

  // load model
  const loadModelButton = createButton("Load Model").parent(gui_load_save);
  loadModelButton.class("button");
  loadModelButton.mousePressed(function () {
    loadCustomModel();
  });

  // save model
  const saveModelButton = createButton("Save Model").parent(gui_load_save);
  saveModelButton.class("button");
  saveModelButton.mousePressed(function () {
    saveCustomModel();
  });

  // debug
  const text_output = createDiv().parent('gui');
  text_output.id('output');
  text_output.html('...');

}