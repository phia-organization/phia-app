import { subscribeToCameraTakePhoto } from "@/utils/camera-events";
import { temp_storage } from "@/utils/temp_storage";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AlertModal } from "../AlertModal";
import PhotoPreviewSection from "./CameraPreviewPhoto";

export default function CameraComponent({
  photo,
  setPhoto,
}: {
  permissionAccepted: boolean;
  setPermissionAccepted: (value: boolean) => void;
  photo: any;
  setPhoto: (value: any) => void;
}) {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [checkedPermission, setCheckedPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: "",
  });

  useEffect(() => {
    (async () => {
      if (!permission) return;
      if (!permission.granted && !checkedPermission) {
        await requestPermission();
        setCheckedPermission(true);
      }
    })();
  }, [permission]);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true, exif: false };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takedPhoto);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToCameraTakePhoto(() => {
      if (!photo) handleTakePhoto();
    });
    return () => {
      unsubscribe();
    };
  }, [photo]);

  if (!permission) {
    return <View />;
  }

  if (!isFocused) return null;

  const handleRetakePhoto = () => {
    setPhoto(null);
  };

  const handleSavePhoto = async () => {
    if (!photo) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: photo.uri,
      name: `photo_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API_URL não foi definida no arquivo .env");
      }

      console.log(`Enviando para a API: ${apiUrl}/predict`);

      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro da API:", response.status, errorText);
        throw new Error(
          "A API retornou um erro. Verifique os logs do console."
        );
      }

      const data = await response.json();

      temp_storage.captured_photo = photo;

      router.push({
        pathname: "/predictedPh",
        params: { apiResponse: JSON.stringify(data) },
      });
    } catch (error) {
      console.error("Erro ao enviar a foto:", error);
      setErrorModal({
        visible: true,
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (photo)
    return (
      <>
        <PhotoPreviewSection
          photo={photo}
          handleRetakePhoto={handleRetakePhoto}
          handleSavePhoto={handleSavePhoto}
          isLoading={isLoading}
        />
        <AlertModal
          visible={errorModal.visible}
          type="error"
          title="Erro ao enviar a foto!"
          message={errorModal.message}
          actions={[
            {
              text: "OK",
              onPress: () => {
                setErrorModal({ visible: false, message: "" });
              },
              style: "destructive",
            },
          ]}
        />
      </>
    );

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}></CameraView>
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
