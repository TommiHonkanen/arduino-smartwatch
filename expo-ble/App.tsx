import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import WallpaperModal from "./WallpaperModal";
import { PulseIndicator } from "./PulseIndicator";
import useBLE from "./useBLE";

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
  const [message, setMessage] = useState<string>("");

  const API_KEY = ""; // Add your own API key here
  const location = "Otaniemi";

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

  const openModal = async () => {
    scanForDevices();
    setIsDeviceModalVisible(true);
  };

  const updateWeather = async () => {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
    );

    const data = await response.json();

    const formattedString =
      (data.main.temp - 273.15).toFixed(2) +
      " " +
      data.main.humidity +
      " " +
      data.wind.speed +
      " " +
      data.clouds.all;

    sendData(formattedString, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}>
              <TouchableOpacity
                onPress={() => updateWeather()}
                style={{ ...styles.button, width: 200 }}>
                <Text style={styles.buttonText}>Update Weather</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsWallpaperModalVisible(true)}
                style={{ ...styles.button, width: 200 }}>
                <Text style={styles.buttonText}>Change Wallpaper</Text>
              </TouchableOpacity>
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
        sendWallpaper={sendData}
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
  text: {
    fontSize: 25,
    marginTop: 15,
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
});

export default App;
