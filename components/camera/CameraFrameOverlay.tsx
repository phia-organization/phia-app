import { useCameraPermissions } from "expo-camera";
import * as Linking from "expo-linking";
import React, { useEffect } from "react";
import {
  AppState,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { useIsFocused } from "@react-navigation/native";

const STRIP_WIDTH = 105;
const BORDER_CORNER_SIZE = 40;
const BORDER_THICKNESS = 3;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const VERTICAL_PADDING_FRACTION = 0.22;
const VERTICAL_PADDING = SCREEN_HEIGHT * VERTICAL_PADDING_FRACTION;

const CENTER_HEIGHT = SCREEN_HEIGHT - VERTICAL_PADDING * 2;

const CENTER_WIDTH = STRIP_WIDTH + BORDER_CORNER_SIZE;
const SIDE_WIDTH = (SCREEN_WIDTH - CENTER_WIDTH) / 2;

export default function CameraFrameOverlay() {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      requestPermission();
    }
  }, [isFocused]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && isFocused) {
        requestPermission();
      }
    });
    return () => subscription.remove();
  }, [isFocused, requestPermission]);

  const renderCorner = (
    position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
  ) => {
    const baseStyle = {
      position: "absolute",
      width: BORDER_CORNER_SIZE,
      height: BORDER_CORNER_SIZE,
      borderColor: Colors.default.accent,
      borderWidth: BORDER_THICKNESS,
    } as const;

    const stylesMap = {
      topLeft: {
        top: -2,
        left: -2,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 8,
      },
      topRight: {
        top: -2,
        right: -2,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 8,
      },
      bottomLeft: {
        bottom: -2,
        left: -2,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
      },
      bottomRight: {
        bottom: -2,
        right: -2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 8,
      },
    };

    return <View style={[baseStyle, stylesMap[position]]} />;
  };
  if (!isFocused) return null;
  return (
    <View style={styles.overlayContainer}>
      <View style={[styles.dimmedHorizontal, { height: VERTICAL_PADDING }]} />
      <View style={styles.row}>
        <View style={[styles.dimmedVertical, { width: SIDE_WIDTH }]} />
        <View style={styles.centerContainer}>
          {permission?.status === "granted" ? (
            <>
              <Text style={styles.instructionText}>
                Enquadre a fita de pH na área demarcada
              </Text>
              <View style={styles.bordersContainer} pointerEvents="none">
                {renderCorner("topLeft")}
                {renderCorner("topRight")}
                {renderCorner("bottomLeft")}
                {renderCorner("bottomRight")}
              </View>
            </>
          ) : permission?.status === "denied" ? (
            <View style={styles.permissionDeniedContainer}>
              <Text style={styles.permissionDeniedText}>
                Permita o acesso à câmera para usar este recurso.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === "android") {
                    Linking.openSettings();
                  } else {
                    Linking.openURL("app-settings:");
                  }
                }}
                style={styles.requestPermissionButton}
                activeOpacity={0.8}
              >
                <Text style={styles.permissionDeniedText}>
                  Habilitar Câmera
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
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
    zIndex: 2,
    pointerEvents: "auto",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    height: CENTER_HEIGHT,
  },
  dimmedHorizontal: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  dimmedVertical: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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
    zIndex: 10,
    elevation: 10,
  },
  instructionText: {
    position: "absolute",
    width: Dimensions.get("window").width,
    top: -VERTICAL_PADDING / 3 + 18,
    textAlign: "center",
    fontSize: 16,
    color: Colors.default.text,
    fontWeight: "600",
    pointerEvents: "auto",
    paddingHorizontal: 20,
  },
  permissionDeniedContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    zIndex: 10,
    gap: 5,
  },
  permissionDeniedText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  requestPermissionButton: {
    backgroundColor: Colors.default.accent,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    zIndex: 10,
  },
  requestPermissionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
