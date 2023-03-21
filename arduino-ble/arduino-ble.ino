#include <ArduinoBLE.h> // include the ArduinoBLE library

// define UUIDs for the BLE service and characteristic
#define SERVICE_UUID        "cb2565ff-270a-432b-91ab-85d58ebaf95d"
#define CHARACTERISTIC_UUID "3fbad818-b029-439d-b639-236e588fe2ca"

BLEService service(SERVICE_UUID); // create a new BLE service instance with the specified UUID
BLECharacteristic characteristic(CHARACTERISTIC_UUID, BLEWrite | BLENotify, 100); // create a new BLE characteristic instance with the specified UUID and properties
String receivedString; // create a global variable to store the received string

void setup() {
  Serial.begin(9600); // start the serial communication with the specified baud rate
  while (!Serial); // wait until the serial port is ready
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
  }
}
