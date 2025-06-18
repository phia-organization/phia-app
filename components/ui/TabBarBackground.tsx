import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const height = 90;
const notchRadius = 40;
const notchWidth = notchRadius * 2.6;

export function useBottomTabOverflow() {
  return 90; // altura da sua tab bar personalizada
}

export default function TabBarBackground() {
  const d = `
    M0 ${80} 
    C0 0, 0 0, ${80} 0
    H${(width - notchWidth) / 2}
    C${(width - notchWidth) / 2 + 10} 0, ${
    (width - notchWidth) / 2 + 10
  } ${notchRadius}, ${width / 2} ${notchRadius}
    C${(width + notchWidth) / 2 - 10} ${notchRadius}, ${
    (width + notchWidth) / 2 - 10
  } 0, ${(width + notchWidth) / 2} 0
    H${width - 80}
    C${width} 0, ${width} 0, ${width} 80
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
