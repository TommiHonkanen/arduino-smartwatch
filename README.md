# Arduino Nano 33 BLE Smartwatch App

This project creates a weather display using an Arduino Nano 33 BLE board and an ST7789 display. It retrieves weather data from a Bluetooth-enabled device and shows it on the display along with the date and time. The display can show three different views: date and time, temperature and humidity, and wind speed and cloud coverage. The user can switch between views by pressing a button. An Expo React Native app is included for controlling the smartwatch. The Expo app can be used to control certain elements on the smartwatch screen such as the wallpaper and the weather data that is displayed. More information about the expo app can be found at the bottom of this README.

## Prerequisites

Before using this app, you need to have the following installed:

- Arduino IDE
- Adafruit GFX Library
- Adafruit ST7789 Library
- RTClib Library
- Wire Library
- Arduino BLE library

## Hardware Requirements

- Arduino Nano 33 BLE board
- TFT display (Adafruit ST7789)
- Real-Time Clock (RTC) module (DS3231)
- Android device for running the Expo app
- Button
- 3.7V LiPo battery (optional)

## Setup

1. Connect the display and SD card to the Arduino Nano 33 BLE board according to the following pin mapping:

| Display | Arduino Nano 33 BLE |
| ------- | ------------------- |
| 3V      | 3.3V                |
| G       | GND                 |
| CK      | 13                  |
| SO      | 12                  |
| SI      | 11                  |
| TC      | 10                  |
| RT      | 9                   |
| DC      | 8                   |
| CC      | 4                   |

| RTC | Arduino Nano 33 BLE |
| --- | ------------------- |
| SCL | A5                  |
| SDA | A4                  |
| VCC | 3.3V                |
| G   | GND                 |

Additionally, connect the button to pin 3 and GND and the battery to the VIN and GND pins.

2. Install the required libraries in Arduino IDE.

3. Upload the code to the Arduino Nano 33 BLE board.

4. Disconnect the board from the computer and connect the battery to the VIN and GND pins. (optional)

5. The current time, date and an image will be displayed on the screen.

6. Install the Expo app on your Android device.

7. Connect to the Arduino Nano 33 BLE board from the Expo app.

## Bluetooth Communication

The Arduino Nano 33 BLE board communicates with a Bluetooth-enabled device using the Bluetooth Low Energy (BLE) protocol. The board advertises a service with a unique UUID (cb2565ff-270a-432b-91ab-85d58ebaf95d) and a characteristic with a unique UUID (3fbad818-b029-439d-b639-236e588fe2ca). The Bluetooth-enabled device can write data to this characteristic, and the Arduino board can receive and process the data. The received data is used to update the weather information on the display.

## Customization

- Wallpaper Images: The sketch includes three bitmap images (big chungus, rick, and saul). You can replace these images with your own custom images by updating the corresponding PROGMEM arrays. The images must be 240x240 pixels. You can use [LCD Image Converter](https://sourceforge.net/projects/lcd-image-converter/) to convert your images to the correct format.
- Views and Data Processing: The sketch currently supports three views: date and time, temperature and humidity, and wind speed and cloud coverage. You can modify the `drawInformation()` functions to customize the views or add additional views as per your requirements. Additionally, you can update the data processing logic in the `loop()` function
- Bluetooth UUIDs: If you want to use different UUIDs for the Bluetooth service and characteristic, you can modify the SERVICE_UUID and CHARACTERISTIC_UUID constants in the sketch. You will also need to update the UUIDs in the Expo app.

# Expo React Native App

The second part of this repository contains the code for the Expo React Native app that interacts with the Arduino Nano 33 BLE. The app allows you to connect to the Arduino Nano 33 BLE, send data, and control various features. [This app](https://github.com/friyiajr/BLESampleExpo) was used as the starting point for this project and was heavily modified to add new features and functionality.

## Features

- Scan for and connect to nearby Bluetooth devices.
- Update weather data on the Arduino Nano 33 BLE using the OpenWeatherMap API.
- Change the wallpaper on the Arduino Nano 33 BLE.

## Prerequisites

- Node.js with npm
- Android device
- API key for OpenWeatherMap API

## Getting Started

1. Clone this repository and navigate to the `expo-ble` directory.

2. Install the required dependencies by running the following command:

   ```bash
   npm install
   ```

3. Install the EAS CLI by running the following command:

   ```bash
   npm install -g eas-cli
   ```

4. Build the development client by running the following command:

   ```bash
   eas build --profile development --platform android
   ```

   to run the build on the EAS Build servers (requires authentication with an Expo account) or

   ```bash
   eas build --profile development --platform android --local
   ```

   to run the build locally (only supported on macOS and Linux and requires various tools to be installed such as an Android SDK and NDK).

5. Install the development client (apk file) on your Android device

6. Start the expo server by running the following command:

   ```bash
   npm run devclient
   ```

7. Scan the QR code shown in the terminal on your Android device to open the app. Make sure that your Android device is connected to the same wi-fi as your computer.

Remember to update the API key in the `WeatherModal.tsx` file if you want to use the weather update feature.

## Usage

- Connect to the Arduino Nano 33 BLE:
  - Press the "Connect" button to scan for nearby devices.
  - Select the Arduino Nano 33 BLE from the available devices.
  - The app will establish a connection with the Arduino Nano 33 BLE.
- Weather Update:
  - Press the "Update Weather" button to fetch weather data from OpenWeatherMap API for a specific location (Otaniemi).
  - The weather data (temperature, humidity, wind speed, and cloud coverage) will be sent to the Arduino Nano 33 BLE.
- Change Wallpaper:
  - Press the "Change Wallpaper" button to select a new wallpaper for the Arduino Nano 33 BLE.
  - Choose from the available options in the modal window.
  - The selected wallpaper will be sent to the Arduino Nano 33 BLE.
