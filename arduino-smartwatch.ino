#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <RTClib.h>
#include <SD.h>

// Pin definitions for the TFT display
#define TFT_CS          10
#define TFT_RST         9
#define TFT_DC          8

// Pin definitions for the SD card
#define SD_CS          4

// Create an instance of the TFT display
Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);

RTC_DS1307 rtc;

char daysOfTheWeek[7][12] = {
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
};

void setup() {
  Serial.begin(9600);
  while (!Serial) {}

  // Initialize the SD card
  if (!SD.begin(SD_CS)) {
    Serial.println("SD card initialization failed!");
    return;
  }

  // Initialize the ST7789 display
  tft.init(240, 240);
  tft.setRotation(1);

  rtc.begin();
  
  tft.fillScreen(ST77XX_BLACK);
  
  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    Serial.flush();
    while (1);
  }

  // Set the current time if the RTC has not been set before
  if (!rtc.isrunning()) {
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
}

void loop() {
  // Open the image file
  File bmpFile = SD.open("image.bmp");

  // Check if the file was opened successfully
  if (!bmpFile) {
    Serial.println("Failed to open image file!");
    return;
  }

  DateTime now = rtc.now();

  String year;
  String month;
  String day;
  String hour;
  String minute;
  String second;

  if (now.month() < 10) {
    month = "0" + String(month);
  } else {
    month = String(month);
  }

  if (now.day() < 10) {
    day = "0" + String(day);
  } else {
    day = String(day);
  }

  if (now.hour() < 10) {
    hour = "0" + String(hour);
  } else {
    hour = String(hour);
  }

  if (now.minute() < 10) {
    minute = "0" + String(minute);
  } else {
    minute = String(minute);
  }

  if (now.second() < 10) {
    second = "0" + String(second);
  } else {
    second = String(second);
  }

  String date = day + ":" + month + ":" + year;

  String time = hour + ":" + minute + ":" + second;

  // Read the BMP header to get the width and height of the image
  uint32_t fileSize = bmpFile.size();
  uint32_t headerSize = 54;
  uint32_t imageWidth = bmpFile.read() + (bmpFile.read() << 8) + (bmpFile.read() << 16) + (bmpFile.read() << 24);
  uint32_t imageHeight = bmpFile.read() + (bmpFile.read() << 8) + (bmpFile.read() << 16) + (bmpFile.read() << 24);

  // Display the BMP image on the screen
  bmpFile.seek(headerSize);
  for (int y = 0; y < imageHeight; y++) {
    for (int x = 0; x < imageWidth; x++) {
      uint8_t b = bmpFile.read();
      uint8_t g = bmpFile.read();
      uint8_t r = bmpFile.read();
      uint16_t color = tft.color565(r, g, b);
      tft.drawPixel(x, y, color);
    }
  }
  bmpFile.close();

  int16_t x, y;
  uint16_t w, h;
  tft.setTextSize(3);
  tft.getTextBounds(date, 0, 0, &x, &y, &w, &h);
  int x_offset = (240 - w) / 2;
  
  tft.setCursor(x_offset, 80);
  tft.setTextColor(ST77XX_GREEN, ST77XX_BLACK);
  tft.print(date);

  tft.setTextSize(4);
  tft.getTextBounds(time, 0, 0, &x, &y, &w, &h);
  x_offset = (240 - w) / 2;
  
  tft.setCursor(x_offset, 120);
  tft.setTextColor(ST77XX_WHITE, ST77XX_BLACK);
  tft.print(time);
}
