import React, { FC } from "react";
import {
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

type WallpaperModalProps = {
  visible: boolean;
  sendWallpaper: (wallpaper: string, call: number) => void;
  closeModal: () => void;
};

const WallpaperModal: FC<WallpaperModalProps> = ({
  visible,
  sendWallpaper,
  closeModal,
}) => {
  return (
    <Modal
      style={modalStyle.modalContainer}
      animationType="slide"
      transparent={true}
      visible={visible}>
      <SafeAreaView style={modalStyle.modalTitle}>
        <Text style={modalStyle.modalTitleText}>Choose a wallpaper</Text>
        <View style={modalStyle.imageContainer}>
          <TouchableOpacity
            onPress={() => {
              sendWallpaper("W0", 0);
              closeModal();
            }}>
            <Image
              style={modalStyle.image}
              source={require("./img/chungus.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              sendWallpaper("W1", 0);
              closeModal();
            }}>
            <Image
              style={modalStyle.image}
              source={require("./img/saul.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              sendWallpaper("W2", 0);
              closeModal();
            }}>
            <Image
              style={modalStyle.image}
              source={require("./img/rick.png")}
            />
          </TouchableOpacity>
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
