import React, { useCallback } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Modal from "react-native-modal";

type WeatherModalListItemProps = {
  location: string;
  closeModal: () => void;
  sendData: (location: string, call: number) => void;
};

type WeatherModalProps = {
  visible: boolean;
  closeModal: () => void;
  sendData: (location: string, call: number) => void;
};

const API_KEY = ""; // Add your own API key here

const locations = [
  "Otaniemi",
  "Helsinki",
  "Tampere",
  "Turku",
  "Oulu",
  "Rovaniemi",
  "London",
  "New York",
  "Tokyo",
  "Antarctica",
];

const WeatherModalListItem = ({
  closeModal,
  location,
  sendData,
}: WeatherModalListItemProps) => {
  const updateWeather = async () => {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
    );

    if (response.status !== 200) {
      console.log("Error fetching weather data. Is your API key correct?");
      Alert.alert("Error fetching weather data", "Is your API key correct?");
      return;
    }

    const data = await response.json();

    const formattedString = `${(data.main.temp - 273.15).toFixed(2)} ${
      data.main.humidity
    } ${data.wind.speed} ${data.clouds.all}`;

    sendData(formattedString, 0);
  };

  return (
    <TouchableOpacity
      style={modalStyle.button}
      onPress={() => {
        updateWeather();
        closeModal();
      }}>
      <Text style={modalStyle.buttonText}>{location}</Text>
    </TouchableOpacity>
  );
};

const WeatherModal = ({ visible, closeModal, sendData }: WeatherModalProps) => {
  const renderWeatherModalListItem = useCallback(
    (item: ListRenderItemInfo<string>) => {
      return (
        <WeatherModalListItem
          location={item.item}
          closeModal={closeModal}
          sendData={sendData}
        />
      );
    },
    [closeModal, sendData]
  );

  return (
    <Modal
      style={modalStyle.modalContainer}
      isVisible={visible}
      onBackButtonPress={() => closeModal()}>
      <SafeAreaView style={modalStyle.modalTitle}>
        <Text style={modalStyle.modalTitleText}>Choose a location</Text>
        <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContainer}
          data={locations}
          renderItem={renderWeatherModalListItem}
        />
      </SafeAreaView>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    margin: 0,
  },
  modalFlatlistContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalTitle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
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

export default WeatherModal;
