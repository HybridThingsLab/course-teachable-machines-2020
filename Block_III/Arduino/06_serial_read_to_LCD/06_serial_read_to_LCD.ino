
// use Grove - LCD RGB Backlight from your Grove Kit and connect it to I2C pin
// https://wiki.seeedstudio.com/Grove-LCD_RGB_Backlight/
// source https://github.com/Seeed-Studio/Grove_LCD_RGB_Backlight

// Install with Sketch > Include Library > Add .ZIP Library
#include <Funken.h>

// libraries
#include <Wire.h>
#include "rgb_lcd.h" // https://github.com/Seeed-Studio/Grove_LCD_RGB_Backlight/archive/master.zip

// instantiation of Funken
Funken fnk;

// LCD Display
rgb_lcd lcd;
unsigned long lastUpdate = 0;
int updateLCD = 100; // interval to update LCD screen

// messages
String message_row1 = "ROW 1";
String message_row2 = "ROW 2";



void setup() {

  // init funken
  fnk.begin(57600, 0, 0); // higher baudrate for better performance
  fnk.listenTo("ROW_ONE", row_one); // however you want to name your callback
  fnk.listenTo("ROW_TWO", row_two); // however you want to name your callback

  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // set RGB backlight
  lcd.setRGB(255, 255, 255);

}

void loop() {

  // needed to make FUNKEN work
  fnk.hark();

  // Do not try to send Serial stuff too often, be prevent this by checking when we sent the last time
  if ((millis() - lastUpdate) > updateLCD) {

    // print (show) text on LCD
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(message_row1);
    lcd.setCursor(0, 1);
    lcd.print(message_row2);


    // update timestamp update LCD screen
    lastUpdate = millis();

  }

}

// callbacks funken
void row_one(char *c) {

  // get first argument
  char *token = fnk.getToken(c); // is needed for library to work properly, but can be ignored

  // get remaining (including blank spaces, p.ex. 'mouse X :')
  message_row1 = fnk.getRemaining();

}
void row_two(char *c) {

  // get first argument
  char *token = fnk.getToken(c); // is needed for library to work properly, but can be ignored

  // get remaining (including blank spaces, p.ex. 'mouse X :')
  message_row2 = fnk.getRemaining();

}
