// use Chrome Browser
// enable the 'experimental-web-platform-features' flag opening 'chrome://flags'

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

  // write values to serial port
  // this time use two different callback functions for Funken (see Arduino Code)

  serialController.write("ROW_ONE");
  serialController.write(" "); // If sending multiple variables, they are seperated with a blank space
  serialController.write("mouse X : " + str(int(mouseX)));
  serialController.write("\r\n"); // to finish your message, send a "new line character"

  serialController.write("ROW_TWO");
  serialController.write(" "); // If sending multiple variables, they are seperated with a blank space
  serialController.write("mouse Y : " + str(int(mouseY)));
  serialController.write("\r\n"); // to finish your message, send a "new line character"

  // instructions
  fill(255);
  textAlign(CENTER, CENTER);
  text("move mouse over canvas", width / 2, height / 2);

}

// init serial connection
function initSerial() {
  serialController.init();
}