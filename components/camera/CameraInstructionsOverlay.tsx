import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraInstructionsOverlay({
  onConfirm,
  onDontShowAgain,
}: {
  onConfirm: () => void;
  onDontShowAgain: () => void;
}) {
  return (
    <View style={styles.overlayContainer}>
      <View style={styles.centerContainer}>
        <View
          style={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Container para bordas */}
          <View style={styles.bordersContainer} pointerEvents="none">
            {/* Top Left */}
            <Image
              source={require("@/assets/images/border.png")}
              alt="top-left"
              style={[styles.corner, styles.topLeft]}
            />
            {/* Top Right */}
            <Image
              source={require("@/assets/images/border.png")}
              alt="top-right"
              style={[
                styles.corner,
                styles.topRight,
                { transform: [{ scaleX: -1 }] },
              ]}
            />
            {/* Bottom Left */}
            <Image
              source={require("@/assets/images/border.png")}
              alt="bottom-left"
              style={[
                styles.corner,
                styles.bottomLeft,
                { transform: [{ scaleY: -1 }] },
              ]}
            />
            {/* Bottom Right */}
            <Image
              source={require("@/assets/images/border.png")}
              alt="bottom-right"
              style={[
                styles.corner,
                styles.bottomRight,
                { transform: [{ scaleX: -1 }, { scaleY: -1 }] },
              ]}
            />
          </View>
          {/* Fita de pH */}
          <View style={styles.stripPlaceholder}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#FAD643",
                borderRadius: 2,
                borderWidth: 1,
                borderColor: "#fff",
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: "#8DC655",
                borderRadius: 2,
                borderWidth: 1,
                borderColor: "#fff",
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: "#14AF9A",
                borderRadius: 2,
                borderWidth: 1,
                borderColor: "#fff",
              }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: "#42378C",
                borderRadius: 2,
                borderWidth: 1,
                borderColor: "#fff",
              }}
            />
          </View>
        </View>
      </View>

      <View style={styles.instructionsBox}>
        <Text style={styles.title}>Aviso</Text>
        <Text style={styles.description}>
          Para escanear a fita, enquadre-a com o cabo voltado para baixo e tente
          deixá-la o mais reta possível
        </Text>

        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dontShowButton}
          onPress={onDontShowAgain}
        >
          <Text style={styles.dontShowButtonText}>Não Exibir Novamente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const STRIP_WIDTH = 60;
const STRIP_HEIGHT = 350;
const BORDER_SIZE = 40;

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
  },
  centerContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-end",
    marginBottom: 0,
    alignItems: "center",
  },
  bordersContainer: {
    position: "absolute",
    width: STRIP_WIDTH + 56,
    height: STRIP_HEIGHT / 1.2 + 8,
    left: -28,
    top: -20,
    zIndex: 2,
  },
  corner: {
    position: "absolute",
    width: BORDER_SIZE,
    height: BORDER_SIZE,
    borderRadius: 8,
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  stripPlaceholder: {
    width: STRIP_WIDTH,
    height: STRIP_HEIGHT,
    padding: 8,
    paddingBottom: "25%",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 2,
    borderColor: "#4B4B4B",
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    marginBottom: -3,
    zIndex: 1,
  },
  instructionsBox: {
    width: "100%",
    backgroundColor: "#0B1525",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    zIndex: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#D1D5DB",
    marginBottom: 20,
  },
  confirmButton: {
    width: "100%",
    backgroundColor: "#4B5563",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  dontShowButton: {
    width: "100%",
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 12,
  },
  dontShowButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});
