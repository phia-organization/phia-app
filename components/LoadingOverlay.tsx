import { Colors } from "@/constants/Colors";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
  text?: string;
}

export const LoadingOverlay = ({
  visible,
  text = "Carregando...",
}: LoadingOverlayProps) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.overlayContainer}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={Colors.default.accent} />
          <Text style={styles.loaderText}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  loaderBox: {
    backgroundColor: Colors.default.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 16,
    width: "60%",
  },
  loaderText: {
    color: Colors.default.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
