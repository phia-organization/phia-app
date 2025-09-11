import { ThemedText } from "@/components/ThemedText";
import { Colors, pHValueColors } from "@/constants/Colors"; // NOVO: Usando nossa paleta de cores
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraInstructionsOverlay({
  onConfirm,
  onDontShowAgain,
}: {
  onConfirm: () => void;
  onDontShowAgain: () => void;
}) {
  // NOVO: Componente para desenhar os cantos, igual ao CameraFrameOverlay
  const Corner = ({
    position,
  }: {
    position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  }) => {
    const baseStyle = {
      position: "absolute",
      width: BORDER_SIZE,
      height: BORDER_SIZE,
      borderColor: Colors.default.accent,
      borderWidth: 2,
    } as const;

    const stylesMap = {
      topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 8,
      },
      topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 8,
      },
      bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
      },
      bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 8,
      },
    };

    return <View style={[baseStyle, stylesMap[position]]} />;
  };

  return (
    <View style={styles.overlayContainer}>
      <View style={styles.centerContainer}>
        <View style={styles.visualGuideContainer}>
          <View style={styles.bordersContainer} pointerEvents="none">
            <Corner position="topLeft" />
            <Corner position="topRight" />
            <Corner position="bottomLeft" />
            <Corner position="bottomRight" />
          </View>
          <View style={styles.stripPlaceholder}>
            <View
              style={{ flex: 1, backgroundColor: pHValueColors["Ácido Leve"] }}
            />
            <View
              style={{ flex: 1, backgroundColor: pHValueColors["Base Leve"] }}
            />
            <View
              style={{
                flex: 1,
                backgroundColor: pHValueColors["Base Moderada"],
              }}
            />
            <View
              style={{ flex: 1, backgroundColor: pHValueColors["Base Forte"] }}
            />
          </View>
        </View>
      </View>

      <View style={styles.instructionsBox}>
        <View style={styles.header}>
          <Ionicons
            name="information-circle-outline"
            size={28}
            color={Colors.default.accent}
          />
          <ThemedText type="title" style={styles.title}>
            Instruções
          </ThemedText>
        </View>
        <ThemedText style={styles.description}>
          Posicione a fita de pH na área demarcada pela câmera, com o cabo
          voltado para baixo.
        </ThemedText>

        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>Entendi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dontShowButton}
          onPress={onDontShowAgain}
        >
          <Text style={styles.dontShowButtonText}>Não exibir novamente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BORDER_SIZE = 40;

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  centerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    bottom: 250,
  },
  visualGuideContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  bordersContainer: {
    position: "absolute",
    width: 116,
    height: 300,
    zIndex: 10,
    elevation: 10,
  },
  stripPlaceholder: {
    width: 60,
    height: 350,
    padding: 8,
    paddingBottom: "25%",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 2,
    borderColor: "#4B4B4B",
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    marginBottom: -100,
    zIndex: 1,
  },
  instructionsBox: {
    width: "100%",
    backgroundColor: Colors.default.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    color: Colors.default.text,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    color: Colors.default.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmButton: {
    width: "100%",
    backgroundColor: Colors.default.accent,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  confirmButtonText: {
    color: Colors.default.primary,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  dontShowButton: {
    width: "100%",
    backgroundColor: Colors.default.card,
    borderRadius: 12,
    paddingVertical: 14,
  },
  dontShowButtonText: {
    width: "100%",
    color: Colors.default.text,
    fontSize: 14,
    textAlign: "center",
  },
});
