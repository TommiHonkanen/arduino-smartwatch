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

  const API_KEY = "03ed9532b61d3531331a01a65d78b6b9";
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
      data.main.temp +
      " " +
      data.main.humidity +
      " " +
      data.wind.speed +
      " " +
      data.clouds.all;

    sendData(formattedString);
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
                style={{ ...styles.ctaButton, width: 200 }}>
                <Text style={styles.ctaButtonText}>Update Weather</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsWallpaperModalVisible(true)}
                style={{ ...styles.ctaButton, width: 200 }}>
                <Text style={styles.ctaButtonText}>Change Wallpaper</Text>
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
                onPress={() => sendData(message)}
                style={{ ...styles.ctaButton, width: 100 }}>
                <Text style={styles.ctaButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.titleText}>Connect to the smartwatch</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
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
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default App;
