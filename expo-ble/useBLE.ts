import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

import base64 from "react-native-base64";
import * as ExpoDevice from "expo-device";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Array<Device>;
  sendData: (value: string, call: number) => void;
}

const SERVICE_UUID = "cb2565ff-270a-432b-91ab-85d58ebaf95d";
const CHARACTERISTIC_UUID = "3fbad818-b029-439d-b639-236e588fe2ca";

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Array<Device>>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Array<Device>, nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1 ||
    devices.findIndex((device) => nextDevice.name === device.name) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device) {
        setAllDevices((prevState: Array<Device>) => {
          if (!isDuplicteDevice(prevState, device) && device.name) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    try {
      if (device && device?.name === "Arduino Nano 33 BLE") {
        const deviceConnection = await bleManager.connectToDevice(device.id);
        setConnectedDevice(deviceConnection);
        await deviceConnection.discoverAllServicesAndCharacteristics();
        bleManager.stopDeviceScan();
      }
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  const sendData = async (value: string, call: number) => {
    console.log("Sending value: ", value);
    console.log("connected device: ", connectedDevice);
    const dataToSend =
      value.length < 100 ? value.padEnd(100, " ") : value.slice(0, 100);

    try {
      await bleManager.writeCharacteristicWithResponseForDevice(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        connectedDevice!.id,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64.encode(dataToSend)
      );
      console.log("Value changed to: ", dataToSend);
      // eslint-disable-next-line prefer-template
      Alert.alert("Value sucessfully sent", "Sent value: " + dataToSend);
    } catch (e) {
      console.log("FAILED TO SEND VALUE", e);
      if (!connectedDevice) {
        Alert.alert("Device not connected", "Please connect to a device");
        return;
      }
      if (call < 20) {
        setTimeout(() => sendData(value, call + 1), 1500);
        return;
      }
      Alert.alert("Failed to send value after 20 attemps", `${e}`);
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    sendData,
  };
}

export default useBLE;
