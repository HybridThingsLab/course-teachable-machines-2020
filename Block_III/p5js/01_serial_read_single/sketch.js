// serial magic happens here > "libraries/webserial.js" 
// good documentation web serial API: https://web.dev/serial/


let connectButton;
let serialController;

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

  // read single value from serial port
  fill(255);
  textAlign(CENTER, CENTER);
  // just if serial controller ready an there is data
  if (serialController.read() && serialController.hasData()) {
    text(serialController.read(), width / 2, height / 2);
  }

}

// init serial connection
function initSerial() {
  serialController.init();
}