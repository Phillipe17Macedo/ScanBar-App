import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return (
      <Text style={styles.permissionText}>
        Requesting for camera permission
      </Text>
    );
  }
  if (hasPermission === false) {
    return <Text style={styles.permissionText}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {cameraActive && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "pdf417",
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "code93",
              "itf14",
            ],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Overlay with scan area highlight */}
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <View style={styles.clearArea} />
        </View>
        <Text style={styles.overlayText}>
          Align the barcode within the frame
        </Text>
      </View>

      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, styles.toggleButton]}
        onPress={() => setCameraActive(!cameraActive)}
      >
        <Text style={styles.buttonText}>
          {cameraActive ? "Close Camera" : "Open Camera"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay background
  },
  scanArea: {
    width: "80%",
    height: "30%",
    borderColor: "#0E7AFE",
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  clearArea: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent", // Lighter background inside scan area
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0E7AFE",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleButton: {
    bottom: 100, // Positioned above the scan again button
  },
});
