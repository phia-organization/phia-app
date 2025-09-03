import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

  const [user, setUser] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    if (!user || !location || !description) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }
    if (!ph) {
      Alert.alert("Erro", "Valor de pH não informado.");
      return;
    }
    const data = {
      user,
      location,
      description,
      ph,
      date: new Date().toISOString(),
      phColor,
      phLevel,
    };
    try {
      const existing = await AsyncStorage.getItem("phRecords");
      const records = existing ? JSON.parse(existing) : [];
      records.push(data);
      await AsyncStorage.setItem("phRecords", JSON.stringify(records));
      Alert.alert("Sucesso", "Coleta de pH salva com sucesso!");
      setUser("");
      setLocation("");
      setDescription("");
      router.push("/history");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.picture}></View>
      <Text style={styles.label}>Usuário:</Text>
      <TextInput
        placeholderTextColor={"#ccc"}
        style={styles.input}
        value={user}
        onChangeText={setUser}
        placeholder="Seu nome"
      />
      <Text style={styles.label}>Local:</Text>
      <TextInput
        placeholderTextColor={"#c4c4c4ff"}
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Ex: Lago Azul"
      />
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        placeholderTextColor={"#ccc"}
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Observações adicionais"
      />
      <Text style={styles.label}>Valor do pH:</Text>
      <Text style={[styles.input, { borderColor: phColor, color: phColor }]}>
        {ph}
      </Text>
      <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
        <Text style={styles.text}>Salvar Coleta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#3d587560",
    padding: 30,
  },
  picture: {
    width: "65%",
    marginTop: "15%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#ccc",
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginTop: 16,
    color: "#fff",
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    width: "90%",
    fontSize: 16,
    color: "#fff",
  },

  buttonSave: {
    backgroundColor: "#3d587560",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
  },
});

export default SavePh;
