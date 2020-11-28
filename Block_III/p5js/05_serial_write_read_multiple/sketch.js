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

  // drive servo and LED with mouse
  let mappedMouseX = int(map(mouseX, 0, width, 0, 180)); // to servo (0-180)
  let mappedMouseY = int(map(mouseY, 0, height, 0, 255)); // to LED (0-255)

  // write value to serial port
  serialController.write("WHATEVER");
  serialController.write(" "); // If sending multiple variables, they are seperated with a blank space
  serialController.write(str(mappedMouseX)); // send integer as string
  serialController.write(" "); // If sending multiple variables, they are seperated with a blank space
  serialController.write(str(mappedMouseY)); // send integer as string
  serialController.write("\r\n"); // to finish your message, send a "new line character"

  // instructions
  fill(255);
  text("move mouse over canvas", 32, height / 2);

  // just if ready
  if (serialController.read() && serialController.hasData()) {
    // split string into array
    receivedValues = split(serialController.read(), " ");
    // show values
    fill(255);
    text("potentiometer: " + receivedValues[0] + "    switch: " + receivedValues[1], 32, height / 2 + 32);

  }

}

// init serial connection
function initSerial() {
  serialController.init();
}