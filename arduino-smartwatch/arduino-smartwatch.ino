#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <RTClib.h>
#include <SdFat.h>  
#include <Adafruit_SPIFlash.h>    // SPI / QSPI flash library
#include <Adafruit_ImageReader.h> // Image-reading functions

#define TFT_CS          10
#define TFT_RST         9
#define TFT_DC          8
#define SD_CS           4

SdFat                   SD;         // SD card filesystem
Adafruit_ImageReader    reader(SD); // Image-reader object, pass in SD filesys

Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);

RTC_DS1307 rtc;

void setup() {
  Serial.begin(9600);
  while (!Serial) {}

  if(!SD.begin(SD_CS, SD_SCK_MHZ(25))) { 
    Serial.println(F("SD begin() failed"));
    for(;;); // Fatal error, do not continue
  }

  tft.init(240, 240);
  tft.setRotation(1);

  tft.fillScreen(ST77XX_BLACK);

  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    Serial.flush();
    while (1);
  }

  rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
}

void loop() {
  DateTime now = rtc.now();

  int sec = now.second();

  String date = addZero(now.day()) + "." + addZero(now.month()) + "." + String(now.year());
  String time = addZero(now.hour()) + ":" + addZero(now.minute()) + ":" + addZero(now.second());

  ImageReturnCode stat;
  stat = reader.drawBMP("/image.bmp", tft, 0, 0);

  int16_t x, y;
  uint16_t w, h;
  tft.setTextSize(3);
  tft.getTextBounds(date, 0, 0, &x, &y, &w, &h);
  int x_offset = (240 - w) / 2;

  tft.setCursor(x_offset, 80);
  tft.setTextColor(ST77XX_GREEN);
  tft.print(date);

  tft.setTextSize(4);
  tft.getTextBounds(time, 0, 0, &x, &y, &w, &h);
  x_offset = (240 - w) / 2;

  tft.setCursor(x_offset, 120);
  tft.setTextColor(ST77XX_WHITE);
  tft.print(time);
}

String addZero(int num) {
  if (num < 10) {
    return "0" + String(num);
  } else {
    return String(num);
  }
}





