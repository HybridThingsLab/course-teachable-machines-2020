// use one of these analog sensors from your Grove Kit
// https://wiki.seeedstudio.com/Grove-Rotary_Angle_Sensor/
// https://wiki.seeedstudio.com/Grove-Light_Sensor/
// https://wiki.seeedstudio.com/Grove-Temperature_Sensor/ > look at code example
// https://wiki.seeedstudio.com/Grove-Sound_Sensor/ > look at code example

// These constants won't change. They're used to give names to the pins used:
const int analogInPin = 0; // or A0  // digital input pin that the sensor is attached to

int sensorValue = 0;        // value read from sensor

unsigned long lastSent = 0;
int updateSerial = 10; // interval to send value via serial port


void setup() {
  // initialize serial communications at 57600 bps:
  Serial.begin(57600);
  // for analog input pin no initialization as an input needed !
}

void loop() {
  
  // read the analog pin
  sensorValue = analogRead(analogInPin);

  // Do not try to send Serial stuff too often, be prevent this by checking when we sent the last time
  if((millis() - lastSent) > updateSerial){

    // print the results to the Serial Monitor:
    Serial.println(sensorValue);
    
    // update timestamp last sent
    lastSent = millis();
  }
  
}
