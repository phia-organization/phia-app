import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const STRIP_WIDTH = 90;
const STRIP_HEIGHT = 300;
const BORDER_SIZE = 40;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CENTER_WIDTH = STRIP_WIDTH + 26;
const CENTER_HEIGHT = STRIP_HEIGHT;
const SIDE_WIDTH = (SCREEN_WIDTH - CENTER_WIDTH) / 2;
const VERTICAL_PADDING = (SCREEN_HEIGHT - CENTER_HEIGHT) / 2;

export default function CameraFrameOverlay() {
  return (
    <View style={styles.overlayContainer}>
      <View style={[styles.dimmedHorizontal, { height: VERTICAL_PADDING }]} />

      <Text
        style={{
          top: VERTICAL_PADDING / 1.3,
          position: "absolute",
          color: "white",
          fontSize: 13,
        }}
      >
        Enquadre a fita de pH na área demarcada
      </Text>

      <View style={styles.row}>
        <View style={[styles.dimmedVertical, { width: SIDE_WIDTH }]} />

        <View style={styles.centerContainer}>
          <View
            style={{
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={styles.bordersContainer} pointerEvents="none">
              <Image
                source={require("@/assets/images/border-active.png")}
                alt="top-left"
                style={[styles.corner, styles.topLeft]}
              />
              <Image
                source={require("@/assets/images/border-active.png")}
                alt="top-right"
                style={[
                  styles.corner,
                  styles.topRight,
                  { transform: [{ scaleX: -1 }] },
                ]}
              />
              <Image
                source={require("@/assets/images/border-active.png")}
                alt="bottom-left"
                style={[
                  styles.corner,
                  styles.bottomLeft,
                  { transform: [{ scaleY: -1 }] },
                ]}
              />
              <Image
                source={require("@/assets/images/border-active.png")}
                alt="bottom-right"
                style={[
                  styles.corner,
                  styles.bottomRight,
                  { transform: [{ scaleX: -1 }, { scaleY: -1 }] },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={[styles.dimmedVertical, { width: SIDE_WIDTH }]} />
      </View>

      <View style={[styles.dimmedHorizontal, { height: VERTICAL_PADDING }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    height: CENTER_HEIGHT,
  },
  dimmedHorizontal: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  dimmedVertical: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    height: CENTER_HEIGHT,
  },
  centerContainer: {
    width: CENTER_WIDTH,
    height: CENTER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  bordersContainer: {
    position: "absolute",
    width: CENTER_WIDTH,
    height: CENTER_HEIGHT,
    zIndex: 4,
  },
  corner: {
    position: "absolute",
    width: BORDER_SIZE,
    height: BORDER_SIZE,
    borderRadius: 8,
  },
  topLeft: {
    top: -5,
    left: -5,
  },
  topRight: {
    top: -5,
    right: -5,
  },
  bottomLeft: {
    bottom: -5,
    left: -5,
  },
  bottomRight: {
    bottom: -5,
    right: -5,
  },
});
