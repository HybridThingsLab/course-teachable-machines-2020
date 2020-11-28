// KNN Classification on Webcam Images with handpose

// labels (feel free to add more)
let labels = [
  "A",
  "B",
  "C"
];

// webcam
let video;

// handpose
let handpose;
let poses = [];

// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let inputData = []; // get values in 'gotResultModel'
let predictions = [];
let mostPredictedClass = "";
let valueMostPredictedClass = 0.0;

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

  // init handpose, see also https://google.github.io/mediapipe/solutions/hands.html

  // options
  const options = {
    flipHorizontal: true, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  }
  handpose = ml5.handpose(video, options, modelReady);

  select('#output').html('... loading model');

  // detect if new pose detected and call 'gotResultModel'
  handpose.on('predict', gotResultsModel);

  // Hide the video element, and just show the canvas
  video.hide();

}


function draw() {
  // clear background
  background(0);

  // flip video (= mirror) >>> memory leak issus, do not use for now
  //let flippedVideo = ml5.flipImage(video);

  // show video (flipped)
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // show results of handpose
  drawKeypoints();
  drawSkeleton();

  // show predictions KNN classification
  if (predictions.length > 0) {

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
      if (predictions[i] != null) {
        text(predictions[i].toFixed(3), x + 24, y);
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
  // just update optimized input data if new input data available
  if (poses.length > 0) {
    optimizedInputData = poses[0].landmarks;
    // console.log(optimizedInputData);
  }
}

////////////////////////////
// Visualization handpose //
////////////////////////////

// draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i];
    for (let j = 0; j < pose.landmarks.length; j += 1) {
      const keypoint = pose.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

// draw the skeletons
function drawSkeleton() {

  for (let i = 0; i < poses.length; i++) {
    //onst pose = poses[i];
    let annotations = poses[0].annotations;
    stroke(0, 255, 0);
    for (let j = 0; j < annotations.thumb.length - 1; j++) {
      line(annotations.thumb[j][0], annotations.thumb[j][1], annotations.thumb[j + 1][0], annotations.thumb[j + 1][1]);
    }
    for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
      line(annotations.indexFinger[j][0], annotations.indexFinger[j][1], annotations.indexFinger[j + 1][0], annotations.indexFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
      line(annotations.middleFinger[j][0], annotations.middleFinger[j][1], annotations.middleFinger[j + 1][0], annotations.middleFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
      line(annotations.ringFinger[j][0], annotations.ringFinger[j][1], annotations.ringFinger[j + 1][0], annotations.ringFinger[j + 1][1]);
    }
    for (let j = 0; j < annotations.pinky.length - 1; j++) {
      line(annotations.pinky[j][0], annotations.pinky[j][1], annotations.pinky[j + 1][0], annotations.pinky[j + 1][1]);
    }

    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.thumb[0][0], annotations.thumb[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.indexFinger[0][0], annotations.indexFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.middleFinger[0][0], annotations.middleFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.ringFinger[0][0], annotations.ringFinger[0][1]);
    line(annotations.palmBase[0][0], annotations.palmBase[0][1], annotations.pinky[0][0], annotations.pinky[0][1]);
  }

}

/////////////////////////////////////
// KNN CLASSIFICTATION STARTS HERE //
/////////////////////////////////////


// Add the current input data to the classifier
function addExample(label) {

  // Add an example with a label to the classifier
  if (optimizedInputData.length > 0) {
    knnClassifier.addExample(optimizedInputData, label);
  }

  // update counts
  updateCounts();

}

// Predict the current handpose
function classify() {

  // if there are no labels through error and return
  if (knnClassifier.getNumLabels() <= 0) {
    console.error('There is no examples in any label');
    return;
  }

  // Use knnClassifier to classify which label do these features belong to
  if (optimizedInputData.length > 0) {
    knnClassifier.classify(optimizedInputData, gotResults);
  }

}


// Show the results
function gotResults(err, result) {

  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {

    const confidences = result.confidencesByLabel; // array object

    // get key/label highest values and its value
    let keyHighestValue = Object.keys(confidences).reduce((a, b) => confidences[a] > confidences[b] ? a : b);
    mostPredictedClass = keyHighestValue;
    valueMostPredictedClass = confidences[keyHighestValue];

    // get confidence for each class
    for (let i = 0; i < labels.length; i++) {
      let confidence = confidences[labels[i]];
      predictions[i] = confidence;
    }
  }

  // classify again
  classify();

}


// Save dataset as myKNNDataset.json
function saveKNN() {
  knnClassifier.save('myKNNDataset');
}

// Load dataset to the classifier
function loadKNN() {
  knnClassifier.load('data/myKNNDataset.json', updateCounts);
}

// Update the example count for each label	
function updateCounts() {

  const counts = knnClassifier.getCountByLabel();

  for (let i = 0; i < labels.length; i++) {
    select('#counter_' + labels[i]).html(counts[labels[i]] || 0);
  }
}

// Clear the examples in one label
function clearLabel(classLabel) {
  if (knnClassifier.getNumLabels() <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  knnClassifier.clearLabel(classLabel);
  updateCounts();
}

// Clear all the examples in all labels
function clearAllLabels() {
  if (knnClassifier.getNumLabels() <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  knnClassifier.clearAllLabels();
  updateCounts();
}


/////////////////
// generate gui //
//////////////////
function generateGui(lc) {

  // main gui
  const gui_main = createDiv().parent('gui');

  // load
  const loadButton = createButton("Load Dataset").parent(gui_main);
  loadButton.class("button");
  loadButton.mousePressed(function () {
    loadKNN();
  });

  // save
  const saveButton = createButton("Save Dataset").parent(gui_main);
  saveButton.class("button");
  saveButton.mousePressed(function () {
    saveKNN();
  });

  // clear
  const clearButton = createButton("Clear Dataset").parent(gui_main);
  clearButton.class("button");
  clearButton.mousePressed(function () {
    clearAllLabels();
  });

  // predict
  const predictButton = createButton("Start Prediction").parent(gui_main);
  predictButton.class("button");
  predictButton.id("predict-button");
  predictButton.mousePressed(function () {
    classify();
  });

  // gui classes

  for (let i = 0; i < lc.length; i++) {

    // container buttons class
    const gui_class = createDiv().parent('gui');

    // add example button
    const add_example_button = createButton(lc[i]).parent(gui_class);
    add_example_button.html("Add an Example to Class " + lc[i]);
    add_example_button.class("button");
    add_example_button.mousePressed(function () {
      // add one example immediately
      addExample(lc[i]);
    });

    // clear examples button
    const clear_examples_button = createButton(lc[i]).parent(gui_class);
    clear_examples_button.html("Clear Class " + lc[i]);
    clear_examples_button.class("button");
    // add example while button pressed
    clear_examples_button.mousePressed(function () {
      clearLabel(lc[i]);
    });


    // counter examples
    const counter_examples = createSpan('0').parent(gui_class);
    counter_examples.class("text-gui");
    counter_examples.id("counter_" + lc[i]);

  }

  // debug
  const text_output = createDiv().parent('gui');
  text_output.id('output');
  text_output.html('...');

}