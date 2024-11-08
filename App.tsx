import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";

// Componente
import { Overlay } from "./components/Overlay";
import { LoadingModal } from "./components/Modal/LoadingModal";

//styles
import { styles } from "./styles/styles";
import { Ionicons } from "@expo/vector-icons";

// method from API
import { cadastrarCodigoBarra } from "./utils/cadastrarCodigoBarra";

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const mapBarcodeType = (type: string | number): string => {
    const typeMapping: { [key: string]: string } = {
      // EAN-13
      "org.gs1.EAN-13": "EAN-13",
      "32": "EAN-13",

      // EAN-8
      "org.gs1.EAN-8": "EAN-8",
      "13": "EAN-8",

      // UPC-A
      "org.gs1.UPC-A": "UPC-A",
      "12": "UPC-A",

      // UPC-E
      "org.gs1.UPC-E": "UPC-E",
      "9": "UPC-E",

      // Code 39
      "org.iso.Code39": "Code 39",
      "39": "Code 39",

      // Code 93
      "org.iso.Code93": "Code 93",
      "93": "Code 93",

      // Code 128
      "org.iso.Code128": "Code 128",
      "128": "Code 128",

      // ITF (Interleaved 2 of 5)
      "org.iso.ITF": "ITF",
      "25": "ITF",

      // PDF417
      "org.iso.PDF417": "PDF417",
      "57": "PDF417",

      // Aztec Code
      "org.iso.Aztec": "Aztec",
      aztec: "Aztec",

      // Data Matrix
      "org.iso.DataMatrix": "Data Matrix",
      datamatrix: "Data Matrix",

      // Codabar
      "org.iso.Codabar": "Codabar",
      codabar: "Codabar",
    };

    return typeMapping[type] || "Unknown";
  };

  const handleBarcodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    setLoading(true);

    const codigoBarra = {
      tipo: mapBarcodeType(type),
      codigo: data,
      dataLeitura: new Date().toISOString(),
    };
    console.log("Informações: ", codigoBarra);

    try {
      const response = await cadastrarCodigoBarra(codigoBarra);
      setLoading(false);
      if (response) {
        Alert.alert("Sucesso", "Código de barras cadastrado com sucesso!");
      } else {
        Alert.alert("Erro", "Falha ao cadastrar o código de barras.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao tentar cadastrar o código de barras."
      );
      console.error("Erro ao cadastrar código de barras:", error);
    }
  };

  // const handleBarcodeScanned = ({ type, data }: any) => {
  //   // Tipagem explícita
  //   setScanned(true);
  //   alert(`Código escaneado com tipo ${type} e dados: ${data}`);
  // };

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
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "code93",
              "itf14",
              "pdf417",
              "codabar",
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
      <LoadingModal
        visible={loading}
        message="Cadastrando código de barras..."
      />
    </View>
  );
}
