import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const height = 90;
const notchRadius = 38;
const notchWidth = notchRadius * 2;

export default function TabBarBackground() {
  const d = `
    M0 0
    H${(width - notchWidth) / 2}
    C${(width - notchWidth) / 2 + 10} 0, ${
    (width - notchWidth) / 2 + 10
  } ${notchRadius}, ${width / 2} ${notchRadius}
    C${(width + notchWidth) / 2 - 10} ${notchRadius}, ${
    (width + notchWidth) / 2 - 10
  } 0, ${(width + notchWidth) / 2} 0
    H${width}
    V${height}
    H0
    Z
  `;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg
        width={width}
        height={height}
        style={{ position: "absolute", bottom: 0 }}
      >
        <Path d={d} fill="#0B1525" />
      </Svg>
    </View>
  );
}
