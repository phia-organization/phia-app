import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";
import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PhotoPreviewSection = ({
  photo,
  handleRetakePhoto,
  handleSavePhoto,
}: {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
  handleSavePhoto?: () => void;
}) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <ThemedText type="subtitle" style={{ textAlign: "center" }}>
        Verifique a foto
      </ThemedText>
      <ThemedText
        style={{ color: Colors.default.textSecondary, textAlign: "center" }}
      >
        A imagem está nítida e bem iluminada?
      </ThemedText>
    </View>

    <View style={styles.imageContainer}>
      <Image
        style={styles.previewImage}
        source={{ uri: "data:image/jpg;base64," + photo.base64 }}
      />
    </View>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto}>
        <Ionicons name="close" size={24} color={Colors.default.tint} />
        <Text style={styles.retakeButtonText}>Repetir</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.confirmButton} onPress={handleSavePhoto}>
        <Ionicons
          name="checkmark-circle-outline"
          size={24}
          color={Colors.default.primary}
        />
        <Text style={styles.confirmButtonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.default.primary,
    justifyContent: "flex-start",
    padding: 16,
  },
  header: {
    paddingTop: 30,
    width: "100%",
    gap: 4,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0,
    backgroundColor: Colors.default.background,
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 16,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    marginTop: 16,
  },
  retakeButton: {
    backgroundColor: Colors.default.card,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  retakeButtonText: {
    color: Colors.default.tint,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.default.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
    gap: 8,
    shadowColor: Colors.default.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButtonText: {
    color: Colors.default.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PhotoPreviewSection;
