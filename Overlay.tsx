import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

// Ajuste as dimensões para uma área retangular
const innerWidth = width * 0.8;
const innerHeight = height * 0.2;

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerWidth / 2,
    height / 2 - innerHeight / 2,
    innerWidth,
    innerHeight
  ),
  10,
  10
);

export const Overlay = () => {
  return (
    <Canvas
      style={
        Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject
      }
    >
      <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
    </Canvas>
  );
};
