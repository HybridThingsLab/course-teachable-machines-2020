// serial magic happens here > "libraries/webserial.js" 
// good documentation web serial API: https://web.dev/serial/


let connectButton;
let serialController;
let receivedValues = [];

function setup() {

  // canvas
  canvas = createCanvas(640, 480).parent('canvas');

  // init serial connection with baudrate
  serialController = new SerialController(57600);

  // init gui
  connectButton = createButton("Initialize Serial Connection");
  connectButton.class("button");
  connectButton.mousePressed(initSerial);
}

function draw() {

  // background
  background(0);

  // just if ready
  if (serialController.read() != undefined) {
    // split string into array
    receivedValues = split(serialController.read(), " ");
    // show values
    fill(255);
    text("potentiometer: " + receivedValues[0] + "    switch: " + receivedValues[1], 32, height / 2);

  }

}

// init serial connection
function initSerial() {
  serialController.init();
}