import { Prediction } from "@/types/prediction";
import { subscribeToCameraTakePhoto } from "@/utils/camera-events";
import { temp_storage } from "@/utils/temp_storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import PhotoPreviewSection from "./CameraPreviewPhoto";

export default function CameraComponent({
  permissionAccepted,
  setPermissionAccepted,
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
  const [loading, setLoading] = useState(false);
  const [checkedPermission, setCheckedPermission] = useState(false);

  useEffect(() => {
    (async () => {
      if (!permission) return;
      if (!permission.granted && !checkedPermission) {
        await requestPermission();
        setCheckedPermission(true);
      }
    })();
  }, [permission]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("ph_predictions");
      if (jsonValue !== null) {
        const parsedPredictions = JSON.parse(jsonValue);
        console.log("Stored data:", parsedPredictions);
      }
    } catch (e) {
      // error reading value
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem("ph_predictions");
    } catch (e) {
      // saving error
    }
  };

  const storeNewPrediction = async (newPrediction: Prediction) => {
    try {
      const existingJsonPredictions = await AsyncStorage.getItem(
        "ph_predictions"
      );

      let existingPredictions: Prediction[] = [];
      if (existingJsonPredictions !== null) {
        existingPredictions = JSON.parse(existingJsonPredictions);
      }

      existingPredictions.push(newPrediction);

      await AsyncStorage.setItem(
        "ph_predictions",
        JSON.stringify(existingPredictions)
      );
    } catch (e) {
      console.error("Failed to store new prediction:", e);
    }
  };

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
    setLoading(true);

    await storeNewPrediction({
      predicted_ph: Math.floor(Math.random() * 14),
      rgbs: {
        q1: { r: 255, g: 0, b: 0 },
        q2: { r: 0, g: 255, b: 0 },
        q3: { r: 0, g: 0, b: 255 },
        q4: { r: 255, g: 255, b: 0 },
      },
    } as Prediction);

    setLoading(false);

    console.log(photo.uri, "camera");

    temp_storage.captured_photo = photo;

    router.push("/predictedPh");
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
