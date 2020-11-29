# Let's Get Physcial

## p5.js, Arduino and the Grove Starter Kit
Learn how to sense and control things in your physical environment by connection an Arduino microcontroller to your Mac/PC, attach sensors and actuators and writing basic code to let all of them commmunicate.

### Get your tools

* Ardunio UNO, Seedunio, Funduino UNO or similar
* USB Data Cable for your Arduino. __Attention: Some USB Cable are only for charging, not for Data!__
* [Seeed Studio Grove - Starter Kit for Arduino](https://www.seeedstudio.com/Grove-Starter-Kit-for-Arduino-p-1855.html)

### Environment
* Download and install the Arduino IDE from [Arduino.cc](https://www.arduino.cc/en/Main/Software) - on Mac, drag the software to your Applications Folder
* Connect your Arduino to your Mac/PC using a USB Cable
* Open the Arduino Software
* Set the Port in "Tools > Port", on Windows it will be something like "COM5", on MAC more like "/dev/cu.usbmodem14301"
* Select the Board you attached in "Tools > Board: ...", most definitely "Arduino Uno"
* Open a first Example in "File > Examples > 01.Basics > Blink"
* Upload the Sketch to your Board with "Sketch > Upload" or the Arrow pointing right
* The blue LED should now blink

### Attaching Modules to the Arduino
* Carrefully attach the big Grove Base Shield, so that each metal pin goes into its hole
* Set the votage selector on the switch right beside the A0 socket to "5V"
* Plug the green LED into the corresponding holes of the "LED Socket" module, the LED has a "flat" side that should point in the same direction as on the symbolic circle right below the holes
* Attach the LED Socket module to Socket D3 of the Grove Base Shield
* Attach the Rotary Angle Sensor in A0

### Serial API to communicate between P5.js and Arduino
The [Serial API](https://web.dev/serial/) provides a way for websites to read from and write to a serial device with JavaScript. Currently this feature is an "experimental" feature in Google Chrome. To experiment with the Serial API locally on all desktop platforms, without an origin trial token, enable the ```experimental-web-platform-features``` flag opening [chrome://flags](chrome://flags) in your browser.

![serialAPI](docs/serialAPI.jpg)


### Funken - Serial protocol toolkit Library
We use the amazing [Funken library](https://github.com/astefas/Funken) to send all kind of variables (also text, numbers...) and also multiple of them back and forth. Find furthere informations to install additional Arduino Libraries [here](https://www.arduino.cc/en/Guide/Libraries).

# Examples

## send a single value from Arduino to p5.js
live demo [serial_read_singleValue](https://hybridthingslab.github.io/course-teachable-machines/Block_III/p5js/01_serial_read_singleValue)

upload XYZ to your Arduino Board

![read_singleValue](docs/01_p5js.jpg)![read_singleValue](docs/01_Arduino.jpg)