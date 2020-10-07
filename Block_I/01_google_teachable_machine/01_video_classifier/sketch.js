 // Classifier Variable
 let classifier;
 // Model URL
 let imageModelURL = 'data/';

 // Video
 let video;
 let flippedVideo;
 // To store the classification
 let label = "";

 // Load the model first
 function preload() {
   classifier = ml5.imageClassifier(imageModelURL + 'model.json');
 }

 function setup() {
   createCanvas(640, 480);
   // Create the video
   video = createCapture(VIDEO);
   video.size(640, 480);
   video.hide();
   // Start classifying
   classifyVideo();
 }

 function draw() {
   background(0);
   // Draw the video
   image(flippedVideo, 0, 0);

   // Draw the label
   fill(255);
   textSize(16);
   textAlign(CENTER);
   text(label, width / 2, height - 4);
 }

 // Get a prediction for the current video frame
 function classifyVideo() {

   // flip video (= mirror)
   flippedVideo = ml5.flipImage(video);

   // classify video
   classifier.classify(flippedVideo, gotResult);

 }

 // When we get a result
 function gotResult(error, results) {
   // If there is an error
   if (error) {
     console.error(error);
     return;
   }
   // The results are in an array ordered by confidence.
   label = results[0].label;

   // magic happens here!!!

   // check String of label and decide what to do
   //if (label == "A") {
   //  console.log("class A detected");
   //}

   // Classifiy again!
   classifyVideo();
 }