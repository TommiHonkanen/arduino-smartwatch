import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "./components/DeviceConnectionModal";
import WallpaperModal from "./components/WallpaperModal";
import WeatherModal from "./components/WeatherModal";
import { PulseIndicator } from "./components/PulseIndicator";
import useBLE from "./useBLE";
import { Device } from "react-native-ble-plx";

const App = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    sendData,
  } = useBLE();
  const [isDeviceModalVisible, setIsDeviceModalVisible] =
    useState<boolean>(false);
  const [isWallpaperModalVisible, setIsWallpaperModalVisible] =
    useState<boolean>(false);
  const [isWeatherModalVisible, setIsWeatherModalVisible] =
    useState<boolean>(false);
  // const [message, setMessage] = useState<string>("");

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideDeviceModal = () => {
    setIsDeviceModalVisible(false);
  };

  const hideWallpaperModal = () => {
    setIsWallpaperModalVisible(false);
  };

  const hideWeatherModal = () => {
    setIsWeatherModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsDeviceModalVisible(true);
  };

  const deviceName: Device | null = connectedDevice;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <Text style={styles.deviceText}>
              {deviceName ? deviceName.name : "No device connected"}
            </Text>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => setIsWeatherModalVisible(true)}
                  style={{ ...styles.button, width: 200, marginBottom: 15 }}>
                  <Text style={styles.buttonText}>Update Weather</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsWallpaperModalVisible(true)}
                  style={{ ...styles.button, width: 200 }}>
                  <Text style={styles.buttonText}>Change Wallpaper</Text>
                </TouchableOpacity>
              </View>
              {/*}
              <Text style={styles.titleText}>Enter a value:</Text>
              <TextInput
                style={{
                  height: 40,
                  width: 300,
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 8,
                  fontSize: 18,
                  fontFamily: "Avenir",
                  marginVertical: 20,
                }}
                onChangeText={(text) => setMessage(text)}
                value={message}
              />
              <TouchableOpacity
                onPress={() => sendData(message, 0)}
                style={{ ...styles.button, width: 100 }}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              */}
            </View>
          </>
        ) : (
          <Text style={styles.titleText}>Connect to the smartwatch</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.button}>
        <Text style={styles.buttonText}>
          {connectedDevice ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideDeviceModal}
        visible={isDeviceModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
      <WallpaperModal
        closeModal={hideWallpaperModal}
        visible={isWallpaperModalVisible}
        sendData={sendData}
      />
      <WeatherModal
        closeModal={hideWeatherModal}
        visible={isWeatherModalVisible}
        sendData={sendData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  button: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  deviceText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  buttonContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "35%",
    marginBottom: "20%",
  },
});

export default App;
