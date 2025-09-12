import { Colors } from "@/constants/Colors";
import React from "react";
import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 85;
const BUTTON_WIDTH = 80;
const NOTCH_WIDTH = 90;

export default function TabBarBackground() {
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
    L ${width} ${TAB_BAR_HEIGHT}
    L 0 ${TAB_BAR_HEIGHT}
    Z
  `;

  return (
    <Svg
      width={width}
      height={TAB_BAR_HEIGHT}
      style={{
        position: "absolute",
        bottom: 0,
      }}
    >
      <Path d={d} fill={Colors.default.primary} />
    </Svg>
  );
}
