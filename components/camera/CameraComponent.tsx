import { Prediction } from '@/types/prediction';
import { subscribeToCameraTakePhoto } from '@/utils/camera-events';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import PhotoPreviewSection from './CameraPreviewPhoto';

export default function CameraComponent() {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('ph_predictions');
      if (jsonValue !== null) {
        const parsedPredictions = JSON.parse(jsonValue);
        console.log('Stored data:', parsedPredictions);
      }
    } catch (e) {
      // error reading value
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem('ph_predictions');
    } catch (e) {
      // saving error
    }
  };

  const storeNewPrediction = async (newPrediction: Prediction) => {
    try {
      const existingJsonPredictions = await AsyncStorage.getItem(
        'ph_predictions'
      );

      let existingPredictions: Prediction[] = [];
      if (existingJsonPredictions !== null) {
        existingPredictions = JSON.parse(existingJsonPredictions);
      }

      existingPredictions.push(newPrediction);

      await AsyncStorage.setItem(
        'ph_predictions',
        JSON.stringify(existingPredictions)
      );
    } catch (e) {
      console.error('Failed to store new prediction:', e);
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
    // Camera permissions are still loading.
    return <View />;
  }

  if (!isFocused) return null;

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

  const handleRetakePhoto = () => {
    setPhoto(null);
  };

  const handleSavePhoto = async () => {
    if (!photo) return;
    console.log('Iniciando upload da foto...');
    setLoading(true);
    // try {
    //   const { uri } = photo;
    //   const fileType = uri.split('.').pop() || 'jpg';
    //   const fileName = `photo_${Date.now()}.${fileType}`;

    //   const formData = new FormData();
    //   formData.append('file', {
    //     uri,
    //     name: fileName,
    //     type: `image/${fileType}`,
    //   } as any);

    //   const response = await fetchClientMultipart<Prediction>('/predict', {
    //     method: 'POST',
    //     body: formData,
    //     auth: false,
    //   });

    //   storeData(response);

    //   console.log('✔️ Upload realizado:', response.url);
    router.push('/predictedPh');
    //   // … faça o que precisar com a URL retornada
    // } catch (err) {
    //   console.error('Falha no upload da foto:', err);
    //   // trate o erro para o usuário (toast, alert, etc.)
    // }

    storeNewPrediction({
      predicted_ph: Math.floor(Math.random() * 14), // exemplo de valor
      rgbs: {
        q1: { r: 255, g: 0, b: 0 },
        q2: { r: 0, g: 255, b: 0 },
        q3: { r: 0, g: 0, b: 255 },
        q4: { r: 255, g: 255, b: 0 },
      },
    } as Prediction);

    setLoading(false);
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
    width: '100%',
    height: '100%',
    zIndex: 2,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
  },
  camera: {
    flex: 1,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'red',
    zIndex: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 190,
    zIndex: 10,
  },
});
