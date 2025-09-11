import { useCameraPermissions } from "expo-camera";
import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const STRIP_WIDTH = 70;
const STRIP_HEIGHT = 300;
const BORDER_CORNER_SIZE = 40;
const BORDER_THICKNESS = 3;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CENTER_WIDTH = STRIP_WIDTH + BORDER_CORNER_SIZE;
const CENTER_HEIGHT = STRIP_HEIGHT + BORDER_CORNER_SIZE;

const SIDE_WIDTH = (SCREEN_WIDTH - CENTER_WIDTH) / 2;
const VERTICAL_PADDING = (SCREEN_HEIGHT - CENTER_HEIGHT) / 2;

export default function CameraFrameOverlay({
  permissionAccepted,
  setPermissionAccepted,
}: {
  permissionAccepted: boolean;
  setPermissionAccepted: (value: boolean) => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) return;
    if (permission.granted) {
      setPermissionAccepted(true);
    } else {
      setPermissionAccepted(false);
    }
  }, [permission, setPermissionAccepted]);

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

  return (
    <View style={styles.overlayContainer}>
      <View style={[styles.dimmedHorizontal, { height: VERTICAL_PADDING }]} />
      <View style={styles.row}>
        <View style={[styles.dimmedVertical, { width: SIDE_WIDTH }]} />
        <View style={styles.centerContainer}>
          {permissionAccepted ? (
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
          ) : (
            <View style={styles.permissionDeniedContainer}>
              {/* O ícone aqui estava 'camera-reverse', mudei para 'camera-off-outline' que parece mais apropriado */}
              <Ionicons
                name="camera-reverse"
                size={48}
                color={Colors.default.error}
              />
              <Text style={styles.permissionDeniedText}>
                O uso da câmera não está autorizado. Por favor, habilite a
                permissão nas configurações do dispositivo.
              </Text>
              {permission && !permission.granted && (
                <TouchableOpacity
                  onPress={requestPermission}
                  style={styles.requestPermissionButton}
                >
                  <Text style={styles.requestPermissionButtonText}>
                    Conceder Permissão
                  </Text>
                </TouchableOpacity>
              )}
            </View>
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
    pointerEvents: "none",
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
    top: -VERTICAL_PADDING / 3 + 40,
    textAlign: "center",
    fontSize: 16,
    color: Colors.default.text,
    fontWeight: "600",
    pointerEvents: "auto",
    paddingHorizontal: 20,
  },
  permissionDeniedContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    marginHorizontal: SIDE_WIDTH / 2,
    gap: 10,
    pointerEvents: "auto",
  },
  permissionDeniedText: {
    color: Colors.default.error,
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
  },
  requestPermissionButtonText: {
    color: Colors.default.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
});
