import { fetchClientMultipart } from "@/utils/fetchClient";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PhotoPreviewSection from "./CameraPreviewPhoto";

export default function CameraComponent() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos da sua permissão para acessar a câmera.
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };

      const takedPhoto = await cameraRef.current.takePictureAsync(options);

      setPhoto(takedPhoto);
    }
  };

  const handleRetakePhoto = () => {
    setPhoto(null);
  };

  const handleSavePhoto = async () => {
    if (!photo) return;
    console.log("Iniciando upload da foto...");
    try {
      const { uri } = photo;
      const fileType = uri.split(".").pop() || "jpg";
      const fileName = `photo_${Date.now()}.${fileType}`;

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);

      const response = await fetchClientMultipart<{ url: string }>("/predict", {
        method: "POST",
        body: formData,
        auth: false,
      });

      console.log("✔️ Upload realizado:", response.url);
      // … faça o que precisar com a URL retornada
    } catch (err) {
      console.error("Falha no upload da foto:", err);
      // trate o erro para o usuário (toast, alert, etc.)
    }
  };

  if (photo)
    return (
      <PhotoPreviewSection
        photo={photo}
        handleRetakePhoto={handleRetakePhoto}
        handleSavePhoto={handleSavePhoto}
      />
    );

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    zIndex: 2,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "#fff",
  },
  camera: {
    flex: 1,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "red",
    zIndex: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    marginBottom: 190,
    zIndex: 10,
  },
});
