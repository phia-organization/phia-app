import { subscribeToCameraTakePhoto } from "@/utils/camera-events";
import { temp_storage } from "@/utils/temp_storage";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AlertModal } from "../AlertModal";
import PhotoPreviewSection from "./CameraPreviewPhoto";

const DOMAINS_URL =
  "https://raw.githubusercontent.com/phia-organization/phia-backend/refs/heads/main/domains.json";

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

    let apiUrl = "";

    try {
      console.log("Buscando URL do servidor...");
      const domainsResponse = await fetch(DOMAINS_URL);
      if (!domainsResponse.ok) {
        throw new Error("Não foi possível obter a URL do servidor.");
      }
      const domainsData = await domainsResponse.json();
      apiUrl = domainsData.ngrok;

      if (!apiUrl) {
        throw new Error("URL do Ngrok não encontrada no arquivo de domínios.");
      }
      console.log(`Servidor encontrada em: ${apiUrl}`);

      const formData = new FormData();
      formData.append("file", {
        uri: photo.uri,
        name: `photo_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      console.log(`Enviando para o servidor: ${apiUrl}/predict`);
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Erro do servidor (/predict):", response.status, errorText);
        throw new Error("O servidor retornou um erro ao processar a imagem.");
      }

      const data = await response.json();
      temp_storage.captured_photo = photo;

      router.push({
        pathname: "/predictedPh",
        params: { apiResponse: JSON.stringify(data) },
      });
    } catch (predictError) {
      console.log("Erro no processo de envio:", predictError);

      if (apiUrl) {
        try {
          console.log(`Executando health check em: ${apiUrl}/health-check`);
          const healthResponse = await fetch(`${apiUrl}/health-check`);

          if (healthResponse.ok) {
            setErrorModal({
              visible: true,
              message:
                "O servidor está online, mas houve um erro ao processar sua imagem. Tente uma foto mais nítida ou com melhor iluminação.",
            });
          } else {
            setErrorModal({
              visible: true,
              message:
                "Não foi possível conectar à API. O servidor pode estar offline ou instável.",
            });
          }
        } catch (healthCheckError) {
          console.log("Erro no health check:", healthCheckError);
          setErrorModal({
            visible: true,
            message:
              "Falha de conexão com o servidor. Verifique sua internet ou o status do servidor.",
          });
        }
      } else {
        setErrorModal({
          visible: true,
          message:
            predictError instanceof Error
              ? predictError.message
              : "Erro desconhecido ao buscar a configuração do servidor.",
        });
      }
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
