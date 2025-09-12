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
    backgroundColor: Colors.default.background,
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  header: {
    paddingTop: 24,
    width: "100%",
    gap: 4,
    marginBottom: 8,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 16,
    backgroundColor: Colors.default.card,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    gap: 12,
  },
  retakeButton: {
    backgroundColor: Colors.default.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    flex: 1,
    maxWidth: "48%",
  },
  retakeButtonText: {
    color: Colors.default.tint,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    maxWidth: "48%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.default.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: Colors.default.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonText: {
    color: Colors.default.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PhotoPreviewSection;
