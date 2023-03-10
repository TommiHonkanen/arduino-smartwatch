#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <RTClib.h>

#define TFT_CS          10
#define TFT_RST         9
#define TFT_DC          8

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
