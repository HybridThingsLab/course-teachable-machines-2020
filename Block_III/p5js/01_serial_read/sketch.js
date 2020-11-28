// see also https://web.dev/serial/
// https://github.com/svendahlstrand/web-serial-api >>> OLD!!!


let connectButton;
let serialController;

function setup() {

  // canvas
  canvas = createCanvas(640, 480).parent('myCanvas');

  // init serial connection with baudrate
  serialController = new SerialController(57600);

  // init gui
  connectButton = createButton("Initialize Serial Connection");
  connectButton.mousePressed(initSerial);
}

function draw() {

  // background
  background(0);

  // show current value
  fill(255);
  textAlign(CENTER, CENTER);
  text(serialController.readMessage(), width / 2, height / 2);

}

function initSerial() {
  serialController.init();
}

///////////////////////
// Serial Port Stuff //
///////////////////////

// serial controller //
class SerialController {

  constructor(rate) {
    this.message = "";
    this.baudrate = rate;

    // check if serial supported
    if ("serial" in navigator) {
      console.log("web serial supported");
    } else {
      console.log("web serial not supported");
    }
  }

  async init() {
    if (this.port) {
      //if already connected, disconnect
      // disconnect();

    } else {
      //otherwise connect
      await this.connect();
    }
  }

  async connect() {

    // Filter on devices with the Arduino Uno USB Vendor/Product IDs.
    const filters = [{
        usbVendorId: 0x2341,
        usbProductId: 0x0043
      },
      {
        usbVendorId: 0x2341,
        usbProductId: 0x0001
      }
    ];

    // prompt user to select an Arduino Uno device.
    this.port = await navigator.serial.requestPort({
      filters
    });

    // open port
    await this.port.open({
      baudRate: this.baudrate
    });

    this.textDecoder = new TextDecoderStream();
    this.readableStreamClosed = this.port.readable.pipeTo(this.textDecoder.writable);
    this.reader = this.textDecoder.readable
      .pipeThrough(new TransformStream(new LineBreakTransformer()))
      .getReader();

    // Listen to data coming from the serial device.
    while (true) {
      const {
        value,
        done
      } = await this.reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        reader.releaseLock();
        break;
      }
      // value is a string.
      this.message = value;

    }
  }

  readMessage() {
    return this.message;
  }

}
// helper serial stuff //
class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}