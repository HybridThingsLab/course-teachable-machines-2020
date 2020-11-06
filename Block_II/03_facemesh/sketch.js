// webcam
let video;
let flippedVideo;

// facemesh
let facemesh;
let mesh = [];
let keypoints = [];


function setup() {

  // canvas
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas');

  // init webcam
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // init facemesh, see also https://google.github.io/mediapipe/solutions/face_mesh.html
  // flip horizontal still not working
  facemesh = ml5.facemesh(video, {
    flipHorizontal: false
  }, modelReady);
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

    // have a detailed look in your console
    //console.log(result[0]);

    keypoints = result[0].scaledMesh; // just first face
    //keypoints = result[0].mesh; // if x,y,z position of face is not important use this instead

    // just use x and y coordinate
    inputData = keypoints.map(p => [p[0], p[1]]);
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