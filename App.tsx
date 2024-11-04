import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { Overlay } from "./Overlay"; // Importando o componente Overlay

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Correção de tipagem
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted"); // Tipagem correta agora
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }: any) => {
    // Tipagem explícita
    setScanned(true);
    alert(`Código escaneado com tipo ${type} e dados: ${data}`);
  };

  if (hasPermission === null) {
    return (
      <Text style={styles.permissionText}>
        Aguardando permissão para acessar a Câmera
      </Text>
    );
  }
  if (hasPermission === false) {
    return (
      <Text style={styles.permissionText}>
        Sem permissão para acessar a Câmera
      </Text>
    );
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

      {/* Overlay com área de escaneamento transparente */}
      <Overlay />

      <Text style={styles.overlayText}>
        Alinhe o código de barras ao centro da tela
      </Text>

      {scanned && (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanButtonText}>
            Clique para escanear novamente
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.cameraToggleButton,
          cameraActive ? styles.cameraCloseButton : styles.cameraOpenButton,
        ]}
        onPress={() => setCameraActive(!cameraActive)}
      >
        <Text style={styles.cameraToggleButtonText}>
          {cameraActive ? "Fechar Câmera" : "Abrir Câmera"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  permissionText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 20,
  },
  overlayText: {
    position: "absolute",
    top: "58%",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    opacity: 0.8,
  },
  scanButton: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#0E7AFE",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  cameraToggleButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cameraOpenButton: {
    backgroundColor: "#28a745",
  },
  cameraCloseButton: {
    backgroundColor: "#dc3545",
  },
  cameraToggleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
