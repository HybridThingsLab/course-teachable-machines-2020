 // use servo from your Grove Kit
// https://wiki.seeedstudio.com/Grove-Servo/

// Funken library
// Download the Funken library here: https://github.com/astefas/Funken/tree/master/bin
// Install with Sketch > Include Library > Add .ZIP Library 
#include <Funken.h>

// servo library
#include <Servo.h>

// instantiation of Funken
Funken fnk;

// These constants won't change. They're used to give names to the pins used:
const int servoPin = 6; // digital pin that servor motor is attahced to

int servoValue = 0;           // value used to drive servo motor

Servo servoMotor;  // create servo object to control a servo

void setup() {
  
  // init funken
  fnk.begin(57600, 0, 0); // higher baudrate for better performance
  fnk.listenTo("WHATEVER", whatever); // however you want to name your callback

  // attaches the servo on servo pin to the servo object
  servoMotor.attach(servoPin);
  
}

void loop() {

    // needed to make FUNKEN work
  fnk.hark();

}

void whatever(char *c) {

  // get first argument
  char *token = fnk.getToken(c); // is needed for library to work properly, but can be ignored

  // read servo value from serial port
  int servoValue = atoi(fnk.getArgument(c));

  // tell servo to go to position
  servoMotor.write(servoValue);

}
