/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Modal from "react-native-modal";

type WallpaperModalListItemProps = {
  wallpaper: string;
  closeModal: () => void;
  sendData: (location: string, call: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
};

type WallpaperModalProps = {
  visible: boolean;
  sendData: (wallpaper: string, call: number) => void;
  closeModal: () => void;
};

const WallpaperModalListItem = ({
  wallpaper,
  sendData,
  closeModal,
  image,
}: WallpaperModalListItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        sendData(wallpaper, 0);
        closeModal();
      }}>
      <Image style={modalStyle.image} source={image} />
    </TouchableOpacity>
  );
};

const WallpaperModal = ({
  visible,
  sendData,
  closeModal,
}: WallpaperModalProps) => {
  const chungus = require("../img/chungus.png");
  const saul = require("../img/saul.png");
  const rick = require("../img/rick.png");

  return (
    <Modal
      style={modalStyle.modalContainer}
      isVisible={visible}
      onBackButtonPress={() => closeModal()}>
      <SafeAreaView style={modalStyle.modalTitle}>
        <Text style={modalStyle.modalTitleText}>Choose a wallpaper</Text>
        <View style={modalStyle.imageContainer}>
          <WallpaperModalListItem
            sendData={sendData}
            closeModal={closeModal}
            wallpaper="chungus"
            image={chungus}
          />
          <WallpaperModalListItem
            sendData={sendData}
            closeModal={closeModal}
            wallpaper="saul"
            image={saul}
          />
          <WallpaperModalListItem
            sendData={sendData}
            closeModal={closeModal}
            wallpaper="rick"
            image={rick}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
  },
  imageContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default WallpaperModal;
