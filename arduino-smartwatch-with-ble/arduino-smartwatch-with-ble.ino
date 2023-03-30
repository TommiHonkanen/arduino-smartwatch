#include <Adafruit_GFX.h>          // Graphics library for the display
#include <Adafruit_ST7789.h>       // Display driver library
#include <RTClib.h>                // Real-time clock library
#include <SdFat.h>                 // SD card library
#include <Adafruit_SPIFlash.h>     // SPI / QSPI flash library
#include <Adafruit_ImageReader.h>  // Image-reading functions
#include <ArduinoBLE.h>            // include the ArduinoBLE library

// define UUIDs for the BLE service and characteristic
#define SERVICE_UUID        "cb2565ff-270a-432b-91ab-85d58ebaf95d"
#define CHARACTERISTIC_UUID "3fbad818-b029-439d-b639-236e588fe2ca"

// Define the pins for the display and the SD card
#define TFT_CS   10
#define TFT_RST  9
#define TFT_DC   8
#define SD_CS    4

SdFat SD;                          // Create an SD card object
Adafruit_ImageReader reader(SD);   // Create an image-reader object, pass in SD filesys

Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);  // Create a display object

RTC_DS1307 rtc;                    // Create a real-time clock object

BLEService service(SERVICE_UUID); // create a new BLE service instance with the specified UUID
BLECharacteristic characteristic(CHARACTERISTIC_UUID, BLEWrite | BLENotify, 100); // create a new BLE characteristic instance with the specified UUID and properties
String receivedString; // create a global variable to store the received string

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

  if (!BLE.begin()) { // initialize the BLE module and check if it fails
    Serial.println("Failed to initialize Bluetooth"); // print error message if initialization fails
    while (1); // loop indefinitely if initialization fails
  }

  BLE.setLocalName("Arduino Nano 33 BLE"); // set the local name of the BLE device
  BLE.setAdvertisedService(service); // set the advertised service of the BLE device
  service.addCharacteristic(characteristic); // add the BLE characteristic to the service
  BLE.addService(service); // add the BLE service to the device
  BLE.advertise(); // start advertising the device

  Serial.println("Bluetooth device is ready to receive data."); // print a message to indicate that the device is ready to receive data
}

void loop() {
  BLEDevice central = BLE.central(); // check if a central device is connected
  if (central) { // if a central device is connected
    Serial.print("Connected to central: ");
    Serial.println(central.address()); // print the address of the central device
    while (central.connected()) { // loop while the central device is connected
      drawTime();
      if (characteristic.written()) { // check if the characteristic has been written
        const uint8_t* data = characteristic.value(); // get the value of the characteristic
        receivedString = String(reinterpret_cast<const char*>(data)); // convert the value to a string and store it in the global variable
        int lastNonDotIndex = receivedString.length() - 1; // get the index of the last non-dot character in the received string
        while (lastNonDotIndex >= 0 && receivedString.charAt(lastNonDotIndex) == '.') { // loop while the last character is a dot
          lastNonDotIndex--; // decrement the index
        }
        receivedString = receivedString.substring(0, lastNonDotIndex + 1); // remove the trailing dots from the received string
        Serial.print("Received data: ");
        Serial.println(receivedString.substring(0, 100)); // print the received string without tell null terminator
      }
    }
    Serial.print("Disconnected from central: ");
    Serial.println(central.address()); // print the address of the disconnected central device
  } else {
    drawTime();
  }
}

void drawTime() {
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
