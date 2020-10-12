const MODEL_URL = 'models/';
let canvas;
let vid;
let results;
let landmarks;
let btn;
let div;
let loaded = false;

function setup() {
  div = createDiv('<br>face-api models are loading...');

  canvas = createCanvas(640, 480).parent('myCanvas');

  // use an async callback to load in the models and run the getResults() function
  vid = createCapture(VIDEO, async () => {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    await faceapi.loadFaceExpressionModel(MODEL_URL);
    div.elt.innerHTML = '<br>model loaded!';
    loaded = true;
    getResults(); // init once
  }).parent('myCanvas');
  vid.size(640, 480);
  vid.hide();
}



async function getResults() {
  results = await faceapi.detectSingleFace(vid.elt).withFaceExpressions();
  getResults();
}


function draw() {
  background(0);
  image(vid, 0, 0);
  if (loaded) {

    // results
    if (results) {

      // draw bounding box
      let x = results.detection.box.x;
      let y = results.detection.box.y;
      let w = results.detection.box.width;
      let h = results.detection.box.height;
      noFill();
      stroke(255);
      strokeWeight(2);
      rect(x, y, w, h);

      // expressions
      let expressions = [];
      for (var expr in results.expressions) {
        expressions.push([expr, results.expressions[expr]]);
      }

      // loop trough expressions except last one (because "asSortedArray")
      for (let i = 0; i < expressions.length - 1; i++) {
        let label = expressions[i][0];
        let confidence = expressions[i][1];
        noStroke();
        fill(255)
        textAlign(RIGHT, TOP);
        textSize(12)
        text(label + ":", 70, i * 20 + 10)
        const val = map(confidence, 0, 1, 0, width / 2)
        noStroke();
        fill(255);
        rect(80, i * 20 + 8, val, 15)
        fill(0, 255, 0);
        textAlign(LEFT, TOP);
        text(confidence.toFixed(3), 80, i * 20 + 10);
        textAlign(CENTER, CENTER);
        textSize(24);
        if (confidence > 0.8) {
          text(label, x + w / 2, y + h / 2);
        }
      }
    }
  }
}