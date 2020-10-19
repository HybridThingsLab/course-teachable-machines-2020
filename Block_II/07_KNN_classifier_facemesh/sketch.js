// KNN Classification on Webcam Images with facemesh

// labels (feel free to add more)
let labels = [
  "A",
  "B",
  "C"
];

// webcam
let video;
let flippedVideo;

// facemesh
let facemesh;
let mesh = [];
let keypoints = [];

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

  // init facemesh, see also https://google.github.io/mediapipe/solutions/face_mesh.html
  // flip horizontally not working yet, quick&dirty workaround see modelReady
  facemesh = ml5.facemesh(video, modelReady);
  select('#output').html('... loading model');

  // detect if new facemesh detected and call 'gotResultModel'
  facemesh.on('predict', gotResultsModel);

  // Hide the video element, and just show the canvas
  video.hide();

}


function draw() {
  // clear background
  background(0);

  // flip video (= mirror)
  flippedVideo = ml5.flipImage(video);

  // show video
  image(flippedVideo, 0, 0, width, height);

  // show results of facemesh
  drawBox();
  drawMesh();

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
  // just update optimized input data if new input data available
  if (result.length > 0) {
    mesh = result;
    keypoints = result[0].scaledMesh;
    // keypoints = result[0].mesh; // if x,y,z position of face is not important use this instead
    // just use x and y coordinate
    inputData = keypoints.map(p => [p[0], p[1]]);
    // use x, y and z coordinate
    // inputData = keypoints.map(p => [p[0], p[1], p[2]]);
  }
}

////////////////////////////
// Visualization facemesh //
////////////////////////////

function drawBox() {
  for (let i = 0; i < mesh.length; i += 1) {

    // get position and size bounding box
    let boundingBox = mesh[i].boundingBox;
    let posX = boundingBox.topLeft[0][0];
    let posY = boundingBox.topLeft[0][1];
    let w = boundingBox.bottomRight[0][0] - posX;
    let h = boundingBox.bottomRight[0][1] - posY;

    // flip position x (quick & dirty)
    posX = width - w - posX;

    // draw bounding box
    noFill();
    stroke(0, 255, 0);
    rect(posX, posY, w, h);

  }
}

function drawMesh() {
  for (let i = 0; i < mesh.length; i += 1) {

    // draw keypoints
    for (let j = 0; j < keypoints.length; j += 1) {
      let [x, y] = keypoints[j];
      // flip position x
      x = width - x;
      fill(0, 255, 0);
      noStroke();
      ellipse(x, y, 3, 3);
    }
  }
}

/////////////////////////////////////
// KNN CLASSIFICTATION STARTS HERE //
/////////////////////////////////////


// Add the current frame from the video to the classifier
function addExample(label) {

  // Add an example with a label to the classifier
  if (inputData.length > 0) {
    knnClassifier.addExample(inputData, label);
  }

  // update counts
  updateCounts();

}

// Predict the current frame.
function classify() {

  // if there are no labels through error and return
  if (knnClassifier.getNumLabels() <= 0) {
    console.error('There is no examples in any label');
    return;
  }

  // Use knnClassifier to classify which label do these features belong to
  if (inputData.length > 0) {
    knnClassifier.classify(inputData, gotResults);
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