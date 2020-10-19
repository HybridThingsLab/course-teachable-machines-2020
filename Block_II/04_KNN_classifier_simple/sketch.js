// KNN Classification on Webcam Images with poseNet

// labels (feel free to add more)
let labels = [
  "A",
  "B",
  "C"
];
let activeLabel = "A";

// examples mouse position
let examples_mousePosition = [];


// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let inputData = []; // get values in 'gotResultModel'
let predictions = [];
let mostPredictedClass = "";

function setup() {

  // canvas
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas');

  // generate gui
  generateGui(labels);

  // init 2D array examples mouse position (just for visualization)
  for (let i = 0; i < labels.length; i++) {
    examples_mousePosition[i] = [];
  }

}

function draw() {

  // clear background
  background(0);

  // current input data (= mouseX, mouseY)
  inputData = [mouseX, mouseY];

  // visualization already added examples mouse position
  textAlign(CENTER, CENTER);
  textSize(16);
  noStroke();
  fill(255, 255, 255);
  for (let i = 0; i < examples_mousePosition.length; i++) {
    for (let j = 0; j < examples_mousePosition[i].length; j++) {
      text(labels[i], examples_mousePosition[i][j][0], examples_mousePosition[i][j][1]);
    }
  }


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
    text(mostPredictedClass, width / 2, height / 2);

  }


}

// set active class
function setActiveClass(label) {
  activeLabel = label;
}

// mouse pressed
function mousePressed() {
  // check if inside canvas
  if (mouseX >= 0 && mouseX <= width) {
    if (mouseY >= 0 && mouseY <= height) {
      // add example
      addExample(activeLabel);
      // add position to mouse position array (for visualization)
      for (let i = 0; i < labels.length; i++) {
        if (activeLabel == labels[i]) {
          examples_mousePosition[i].push(inputData);
        }
      }
    }
  }
}


/////////////////////////////////////
// KNN CLASSIFICTATION STARTS HERE //
/////////////////////////////////////


// Add the current frame from the video to the classifier
function addExample(label) {

  // Add an example (= input data) with a label to the classifier
  if (inputData.length > 0) {
    knnClassifier.addExample(inputData, label);
  }

}

// Predict the current mouse position
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

    // get confidence for each class
    for (let i = 0; i < labels.length; i++) {
      let confidence = confidences[labels[i]];
      predictions[i] = confidence;
    }
  }

  // classify again
  classify();

}


/////////////////
// generate gui //
//////////////////
function generateGui(lc) {

  // main gui
  const gui_main = createDiv().parent('gui');

  // debug
  const text_help = createDiv().parent(gui_main);
  text_help.id("text-help");
  text_help.html('select active class and click canvas to add examples... then start prediction');

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
    add_example_button.html("Set " + lc[i] + " to active class");
    add_example_button.class("button");
    add_example_button.mousePressed(function () {
      // setActiveClass
      setActiveClass(lc[i]);
    });

  }

}