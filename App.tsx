import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";

// Componente
import { Overlay } from "./components/Overlay";

//styles
import { styles } from "./styles/styles";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
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
          enableTorch={flashActive}
          style={StyleSheet.absoluteFillObject}
        />
      )}

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

      {cameraActive && (
        <TouchableOpacity
          style={styles.flashButton}
          onPress={() => setFlashActive(!flashActive)}
        >
          <Ionicons
            name={flashActive ? "flash" : "flash-off"}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
