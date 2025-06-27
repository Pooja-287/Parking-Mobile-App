import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface Props {
  onScanned: (data: string) => void;
}

const Scan: React.FC<Props> = ({ onScanned }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text style={styles.message}>Camera permission is required</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={({ data }) => {
          if (!scanned) {
            setScanned(true);
            onScanned(data);
          }
        }}
      ></CameraView>
    </View>
  );
};

export default Scan;

// const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  fullScreen: {
    width: 300,
    height: 300,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 5,
  },
  message: {
    marginTop: 20,
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
  },
  buttonText: {
    color: "#22C55E",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
});
