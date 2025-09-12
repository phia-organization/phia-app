import { Dimensions, StyleSheet, View } from "react-native";

import CameraComponent from "@/components/camera/CameraComponent";
import CameraFrameOverlay from "@/components/camera/CameraFrameOverlay";
import CameraInstructionsOverlay from "@/components/camera/CameraInstructionsOverlay";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Portal } from "react-native-paper";

export default function TabTwoScreen() {
  const [alertVisible, setAlertVisible] = useState(true);
  const [permissionAccepted, setPermissionAccepted] = useState(false);
  const [photo, setPhoto] = useState<any>(null);

  useEffect(() => {
    const checkDontShowAgain = async () => {
      try {
        const value = await AsyncStorage.getItem("dontShowCameraInstructions");
        if (value === "true") {
          setAlertVisible(false);
        }
      } catch (e) {
        console.error("Failed to fetch dontShowCameraInstructions:", e);
      }
    };

    checkDontShowAgain();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Coleta de Imagem</ThemedText>
        <ThemedText style={{ color: Colors.default.textSecondary }}>
          Aponte a câmera para a tira de pH e tire uma foto.
        </ThemedText>
      </View>

      {alertVisible && (
        <Portal>
          <CameraInstructionsOverlay
            onConfirm={() => setAlertVisible(false)}
            onDontShowAgain={() => {
              setAlertVisible(false);
              AsyncStorage.setItem("dontShowCameraInstructions", "true");
            }}
          />
        </Portal>
      )}

      {!alertVisible && (
        <>
          <CameraComponent
            photo={photo}
            setPhoto={setPhoto}
            permissionAccepted={permissionAccepted}
            setPermissionAccepted={setPermissionAccepted}
          />
          {!photo && (
            <CameraFrameOverlay
              permissionAccepted={permissionAccepted}
              setPermissionAccepted={setPermissionAccepted}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.default.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 10,
    backgroundColor: Colors.default.primary,
  },
  titleContainer: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.01,
    left: "50%",
    transform: [{ translateX: "-50%" }],
    width: "auto",
    flexDirection: "row",
    paddingVertical: 10,
    marginTop: Dimensions.get("window").height * 0.035,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: Colors.default.primary,
    gap: 8,
    zIndex: 10,
  },
});
