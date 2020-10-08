  // Global variable to store the classifier
  let classifier;

  // Label
  let label = 'listening...';

  // Teachable Machine model URL
  // for sound model absolute path is needed!
  const absolutePath = location.href.substr(0, location.href.lastIndexOf('/') + 1);
  let soundModel = absolutePath + 'data/';

  function preload() {

    // Load the model
    classifier = ml5.soundClassifier(soundModel + 'model.json');
  }

  function setup() {
    createCanvas(320, 240);
    // Start classifying
    // The sound model will continuously listen to the microphone
    classifier.classify(gotResult);
  }

  function draw() {
    background(0);
    // Draw the label in the canvas
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(label, width / 2, height / 2);

    // magic happens here!!!

    if (label == "A") { // should be same name of label as in google teachable machine
      fill(255, 0, 0);
    }
    if (label == "B") { // should be same name of label as in google teachable machine
      fill(0, 255, 0);
    }
    // further labels possible... 

    noStroke();
    rect(0, 0, width / 2, height / 2);


  }


  // The model recognizing a sound will trigger this event
  function gotResult(error, results) {
    if (error) {
      console.error(error);
      return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;


  }