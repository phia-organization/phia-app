import { Colors } from "@/constants/Colors";
import React from "react";
import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const BUTTON_WIDTH = 80;
const NOTCH_WIDTH = 90;

interface TabBarBackgroundProps {
  height: number;
}

export default function TabBarBackground({ height }: TabBarBackgroundProps) {
  const d = `
    M 0 1 
    L ${(width - NOTCH_WIDTH) / 2} 1
    C ${(width - BUTTON_WIDTH) / 2} 1, ${(width - BUTTON_WIDTH) / 2} 35, ${
    width / 2
  } 35
    C ${(width + BUTTON_WIDTH) / 2} 35, ${(width + BUTTON_WIDTH) / 2} 1, ${
    (width + NOTCH_WIDTH) / 2
  } 1
    L ${width} 1
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

  return (
    <Svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        bottom: 0,
      }}
    >
      <Path d={d} fill={Colors.default.primary} />
    </Svg>
  );
}
