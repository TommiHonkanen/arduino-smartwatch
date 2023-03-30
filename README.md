# Arduino Nano 33 BLE Smartwatch App

This is going to be an Arduino Nano 33 BLE Smartwatch app that displays the current time, date and a wallpaper on a 240x240 resolution display. The Arduino app is designed to communicate with an Expo React Native app via Bluetooth Low Energy. The Expo app can be used to control certain elements on the smartwatch screen such as the wallpaper.

## Prerequisites

Before using this app, you need to have the following installed:

- Arduino IDE
- Adafruit GFX Library
- Adafruit ST7789 Library
- RTClib Library
- SdFat Library
- Adafruit SPIFlash Library
- Adafruit ImageReader Library
- Arduino BLE library

## Hardware Requirements

- Arduino Nano 33 BLE board
- ST7789 display with and SD card slot
- Real-time clock module
- SD card

## Setup 

1. Connect the display and SD card to the Arduino Nano 33 BLE board according to the following pin mapping:

  | Display | Arduino Nano 33 BLE |
  | --- | --- |
  | 3V | 3.3V |
  | G  | GND |
  | CK | 13 |
  | SO | 12 |
  | SI | 11 |
  | TC | 10 |
  | RT | 9 |
  | DC | 8 |
  | CC | 4 |
  
  | RTC | Arduino Nano 33 BLE |
  | --- | --- |
  | SCL | A5  |
  | SDA | A4  |

2. Install the required libraries in Arduino IDE.

3. Upload the code to the Arduino Nano 33 BLE board.

4. Connect the board to a power source.

5. The current time, date and an image will be displayed on the screen.

## Functionality

The app reads the current time from the real-time clock module and displays it on the screen in the format of "HH:MM:SS". It also reads the current date and displays it on the screen in the format of "DD.MM.YYYY".

An image can also be displayed on the screen by saving a file named "image.bmp" to the SD card. The image will be read and displayed on the screen using the Adafruit ImageReader library.
