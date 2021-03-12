// use one of these analog sensors from your Grove Kit
// https://wiki.seeedstudio.com/Grove-Rotary_Angle_Sensor/
// https://wiki.seeedstudio.com/Grove-Light_Sensor/
// https://wiki.seeedstudio.com/Grove-Temperature_Sensor/ > look at code example
// https://wiki.seeedstudio.com/Grove-Sound_Sensor/ > look at code example


// use one of these digital sensors from your Grove Kit
// https://wiki.seeedstudio.com/Grove-Button/
// https://wiki.seeedstudio.com/Grove-Touch_Sensor/

// These constants won't change. They're used to give names to the pins used:
const int analogInPin = 0; // or A0  // digital input pin that the sensor is attached to
const int digitalInPin = 2; // or A0  // digital input pin that the sensor is attached to

int potiValue = 0;        // value from potentiometer
int switchValue = 0;      // value from switch

unsigned long lastSent = 0;
int updateSerial = 10; // interval to send value via serial port


void setup() {
  // initialize serial communications at 57600 bps:
  Serial.begin(57600);
  
  // define digital inputs
  pinMode(digitalInPin,INPUT);
}

void loop() {
  
  // read the analog pin
  potiValue = analogRead(analogInPin);

  // read the digital pin
  switchValue = digitalRead(digitalInPin);

  // Do not try to send Serial stuff too often, be prevent this by checking when we sent the last time
  if((millis() - lastSent) > updateSerial){

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
