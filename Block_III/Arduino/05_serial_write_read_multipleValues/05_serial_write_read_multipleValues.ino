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
const int ledPin = 5; // digital pin that LED is attahced to
const int servoPin = 6; // digital pin that servor motor is attahced to
const int analogInPin = 0; // or A0  // digital input pin that the sensor is attached to
const int digitalInPin = 2; // or A0  // digital input pin that the sensor is attached to

int servoValue = 0;           // value used to drive servo motor
int ledValue = 0;           // pwm value used to drive actuator

int potiValue = 0;        // value from potentiometer
int switchValue = 0;      // value from switch

unsigned long lastSent = 0;
int updateSerial = 10; // interval to send value via serial port

Servo servoMotor;  // create servo object to control a servo

void setup() {

  // init funken
  fnk.begin(57600, 0, 0); // higher baudrate for better performance
  fnk.listenTo("WHATEVER", whatever); // however you want to name your callback

  // define input pins
  pinMode(digitalInPin, INPUT);

  // for analog input + output pin no initialization as an input needed !

  // attaches the servo on servo pin to the servo object
  servoMotor.attach(servoPin);
}

void loop() {

  // needed to make FUNKEN work
  fnk.hark();

  // send values sensors to P5.js

  // read the analog pin
  potiValue = analogRead(analogInPin);

  // read the digital pin
  switchValue = digitalRead(digitalInPin);


  // Do not try to send Serial stuff too often, be prevent this by checking when we sent the last time
  if ((millis() - lastSent) > updateSerial) {

    // message looks like this: "value1 value2 ..."
    // finish message with a line feed > last message with "Serial.println()" instead of "Serial.print()"

    // print sensor value
    Serial.print(potiValue);
    // SPACE
    Serial.print(" ");
    // print switch value
    Serial.println(switchValue);
    // update timestamp last sent
    lastSent = millis();
  }


}

void whatever(char *c) {

  // get first argument
  char *token = fnk.getToken(c); // is needed for library to work properly, but can be ignored

  // read servo value from serial port
  int servoValue = atoi(fnk.getArgument(c));

  // read led value from serial port
  int ledValue = atoi(fnk.getArgument(c));

  // tell servo to go to position
  servoMotor.write(servoValue);

  // control led
  analogWrite(ledPin, ledValue);

}
