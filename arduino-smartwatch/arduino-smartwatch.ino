#include <Adafruit_GFX.h>          // Graphics library for the display
#include <Adafruit_ST7789.h>       // Display driver library
#include <RTClib.h>                // Real-time clock library
#include <SdFat.h>                 // SD card library
#include <Adafruit_SPIFlash.h>     // SPI / QSPI flash library
#include <Adafruit_ImageReader.h>  // Image-reading functions

// Define the pins for the display and the SD card
#define TFT_CS   10
#define TFT_RST  9
#define TFT_DC   8
#define SD_CS    4

SdFat SD;                          // Create an SD card object
Adafruit_ImageReader reader(SD);   // Create an image-reader object, pass in SD filesys

Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);  // Create a display object

RTC_DS1307 rtc;                    // Create a real-time clock object

void setup() {
  Serial.begin(9600);             // Start serial communication at 9600 baud rate
  while (!Serial) {}              // Wait for serial connection

  if(!SD.begin(SD_CS, SD_SCK_MHZ(25))) {  // Check if SD card is initialized correctly
    Serial.println(F("SD begin() failed"));
    for(;;);                      // If SD card not initialized correctly, stop program
  }

  tft.init(240, 240);             // Initialize display with a resolution of 240x240
  tft.setRotation(1);             // Set display rotation to 1 (to change the orientation)
  tft.fillScreen(ST77XX_BLACK);   // Fill the display with black color

  if (!rtc.begin()) {             // Check if the real-time clock module is present
    Serial.println("Couldn't find RTC");
    Serial.flush();               // Flush the serial buffer
    while (1);                    // If real-time clock not present, stop program
  }

  rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));  // Set the real-time clock to the current time
}

void loop() {
  DateTime now = rtc.now();       // Get the current time from the real-time clock module

  String date = addZero(now.day()) + "." + addZero(now.month()) + "." + String(now.year());  // Format the date string
  String time = addZero(now.hour()) + ":" + addZero(now.minute()) + ":" + addZero(now.second());  // Format the time string

  ImageReturnCode stat;           // Create a variable to store the image status
  stat = reader.drawBMP("/image.bmp", tft, 0, 0);  // Read and display the image on the display

  int16_t x, y;
  uint16_t w, h;
  tft.setTextSize(3);            // Set the text size to 3
  tft.getTextBounds(date, 0, 0, &x, &y, &w, &h);  // Get the bounds of the date string
  int x_offset = (240 - w) / 2;  // Calculate the x offset for centering the date string

  tft.setCursor(x_offset, 80);   // Set the cursor position for the date string
  tft.setTextColor(ST77XX_GREEN);  // Set the text color to green
  tft.print(date);                // Print the date string on the display
  tft.setTextSize(4);              // Set the text size to 4
  tft.getTextBounds(time, 0, 0, &x, &y, &w, &h);  // Get the bounds of the time string
  x_offset = (240 - w) / 2;       // Calculate the x offset for centering the time string

  tft.setCursor(x_offset, 120);   // Set the cursor position for the time string
  tft.setTextColor(ST77XX_WHITE); // Set the text color to white
  tft.print(time);                // Print the time string on the display
}

// A function to add a leading zero to the date and time strings if the value is less than 10
String addZero(int num) {
  if (num < 10) {
    return "0" + String(num);     // Add a leading zero and convert the number to a string
  } else {
    return String(num);           // Otherwise, just convert the number to a string
  }
}