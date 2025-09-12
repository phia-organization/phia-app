import { AlertModal } from "@/components/AlertModal";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { temp_storage } from "@/utils/temp_storage";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SavePh: React.FC = () => {
  const { ph, phColor, phLevel } = useLocalSearchParams<{
    ph: string;
    phColor: string;
    phLevel: string;
  }>();

  const capturedPhoto = temp_storage.captured_photo;
  const imageUri = capturedPhoto?.uri;

  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEmptyFields, setIsEmptyFields] = useState(false);

  const handleSave = async () => {
    if (!title || !user || !location || !description) {
      setIsEmptyFields(true);
      return;
    }
    if (!imageUri) {
      Alert.alert("Erro", "Nenhuma imagem encontrada para salvar.");
      return;
    }
    if (!ph) {
      Alert.alert("Erro", "Valor de pH não foi encontrado.");
      return;
    }

    setIsLoading(true);
    const fileName = `phia_image_${Date.now()}.jpg`;
    const newImageUri = FileSystem.documentDirectory + "/" + fileName;

    try {
      await FileSystem.moveAsync({
        from: imageUri,
        to: newImageUri,
      });

      const data = {
        title,
        user,
        location,
        description,
        ph,
        date: new Date().toISOString(),
        phColor,
        phLevel,
        imageUri: newImageUri,
      };

      const existing = await AsyncStorage.getItem("phRecords");
      const records = existing ? JSON.parse(existing) : [];
      records.push(data);
      await AsyncStorage.setItem("phRecords", JSON.stringify(records));

      setIsLoading(false);
      setIsModalVisible(true);
    } catch (error) {
      console.error("O ERRO DETALHADO AO SALVAR É:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
      setIsLoading(false);
    }
  };

  const handleCloseModalAndNavigate = () => {
    setIsModalVisible(false);
    router.push("/history");
  };

  useEffect(() => {
    return () => {
      temp_storage.captured_photo = null;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.default.text} />
        </TouchableOpacity>
        <ThemedText type="title">Salvar Medição</ThemedText>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.imagePlaceholder}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <>
                <Ionicons
                  name="image-outline"
                  size={48}
                  color={Colors.default.textSecondary}
                />
                <View style={{ width: "100%" }}>
                  <ThemedText
                    style={{
                      color: Colors.default.textSecondary,
                      textAlign: "center",
                    }}
                  >
                    Prévia da Fita de pH
                  </ThemedText>
                </View>
              </>
            )}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Resultado Detectado</ThemedText>
            <View style={styles.resultCardContainer}>
              <View
                style={[styles.resultColorBar, { backgroundColor: phColor }]}
              />

              <View style={styles.resultTextContainer}>
                <Text style={[styles.resultValue, { color: phColor }]}>
                  {parseFloat(ph!).toFixed(1)}
                </Text>
                <ThemedText style={styles.resultLevel}>{phLevel}</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Título da Medição</ThemedText>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={"Ex: pH da Piscina"}
              placeholderTextColor={Colors.default.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nome do Usuário</ThemedText>
            <TextInput
              style={styles.input}
              value={user}
              onChangeText={setUser}
              placeholder="Seu nome"
              placeholderTextColor={Colors.default.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Local da Medição</ThemedText>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Ex: Laboratório"
              placeholderTextColor={Colors.default.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Descrição</ThemedText>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Detalhes adicionais..."
              placeholderTextColor={Colors.default.textSecondary}
              multiline
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.default.primary} />
            ) : (
              <>
                <Ionicons
                  name="save-outline"
                  size={22}
                  color={Colors.default.primary}
                />
                <Text style={styles.saveButtonText}>Salvar Medição</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={isEmptyFields}
        type="warning"
        title="Preencha Todos os Campos"
        message="Para prosseguir é necessário preencher todos os campos!"
        actions={[
          {
            text: "Confirmar",
            onPress: () => setIsEmptyFields(false),
            style: "primary",
          },
        ]}
      />
      <AlertModal
        visible={isModalVisible}
        type="success"
        title="Sucesso!"
        message="Sua medição de pH foi salva e adicionada ao seu histórico."
        actions={[
          {
            text: "Ver Histórico",
            onPress: handleCloseModalAndNavigate,
            style: "primary",
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.default.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.default.primary,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
  },
  scrollContainer: {
    padding: 20,
    gap: 16,
  },
  imagePlaceholder: {
    minHeight: 150,
    width: "100%",
    backgroundColor: Colors.default.card,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 16,
  },
  inputGroup: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: Colors.default.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.default.card,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: Colors.default.text,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  phValueDisplay: {
    backgroundColor: Colors.default.card,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    fontWeight: "bold",
    borderWidth: 1,
    overflow: "hidden",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.default.accent,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 10,
    shadowColor: Colors.default.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: Colors.default.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  resultCardContainer: {
    flexDirection: "row",
    backgroundColor: Colors.default.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  resultColorBar: {
    width: 10,
  },
  resultTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  resultValue: {
    fontFamily: "SpaceMono",
    fontSize: 24,
    fontWeight: "bold",
  },
  resultLevel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.default.text,
  },
  previewImage: {
    width: "80%",
    aspectRatio: 1,
    borderRadius: 12,
    resizeMode: "cover",
    marginVertical: 30,
  },
});

export default SavePh;
