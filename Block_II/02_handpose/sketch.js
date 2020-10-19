// webcam
let video;
let flippedVideo;

// handpose
let handpose;
let poses = [];


function setup() {

  // canvas
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas');

  // init webcam
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // init handpose, see also https://google.github.io/mediapipe/solutions/hands.html
  // flip camera horizontally
  handpose = ml5.handpose(video, {
    flipHorizontal: true
  }, modelReady);
  select('#output').html('... loading model');

  // detect if new pose detected and call 'gotResultModel'
  handpose.on('predict', gotResultsModel);

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

  // show results of handpose
  drawKeypoints();
  drawSkeleton();

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