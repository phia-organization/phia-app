import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export function getPhLevel(
  valor: number,
  setPhLevel: React.Dispatch<React.SetStateAction<string>>,
  setPhColor: React.Dispatch<React.SetStateAction<string>>
) {
  if (valor >= 0 && valor <= 2) {
    setPhLevel("Ácido Forte");
    setPhColor("#F63A3D");
  } else if (valor >= 2.1 && valor <= 5) {
    setPhLevel("Ácido Moderado");
    setPhColor("#FF6E00");
  } else if (valor >= 5.1 && valor <= 7) {
    setPhLevel("Levemente Ácida");
    setPhColor("#FFDD00");
  } else if (valor >= 7.1 && valor <= 8) {
    setPhLevel("Levemente Básica");
    setPhColor("#00FF7B");
  } else if (valor >= 8.1 && valor <= 11) {
    setPhLevel("Base Moderada");
    setPhColor("#0088FF");
  } else if (valor >= 11.1 && valor <= 14) {
    setPhLevel("Base Forte");
    setPhColor("#9A4EF6");
  } else {
    // Retorna uma cor padrão ou uma string indicando que o valor está fora do range
    return "#000000";
  }
}

export default function PredictedPh() {
  const [predictedPh, setPredictedPh] = useState<number | null>(null);
  const [phColor, setPhColor] = useState<string>("#000000");
  const [phLevel, setPhLevel] = useState<string>("");

  const getPredictedPh = async () => {
    try {
      const predictedPh = await AsyncStorage.getItem("ph_predictions");
      if (predictedPh !== null) {
        const parsedPredictions = JSON.parse(predictedPh);
        setPredictedPh(
          parsedPredictions.length > 0
            ? parsedPredictions[parsedPredictions.length - 1].predicted_ph
            : null
        );

        getPhLevel(
          parsedPredictions[parsedPredictions.length - 1].predicted_ph,
          setPhLevel,
          setPhColor
        );
      }
    } catch (e) {
      // error reading value
    }
  };

  const phPercentage = predictedPh ? (predictedPh / 14) * 100 : 0;

  while (predictedPh === null) {
    setTimeout(() => {
      getPredictedPh();
    }, 1000);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.default.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text
            style={{
              color: Colors.default.text,
              fontSize: 18,
              textAlign: "center",
            }}
          >
            Voltar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSave}
          onPress={() =>
            router.push({
              pathname: "/savePh",
              params: { ph: predictedPh?.toString(), phColor, phLevel },
            })
          }
        >
          <Text
            style={{
              color: Colors.default.text,
              fontSize: 18,
              textAlign: "center",
            }}
          >
            Salvar
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center", gap: 15 }}>
        <Text style={{ color: Colors.default.text, fontSize: 24 }}>
          Valor do pH:{" "}
        </Text>
        <AnimatedCircularProgress
          size={200}
          width={12}
          fill={phPercentage}
          tintColor={phColor}
          backgroundColor="#3d5875"
          lineCap="round"
          arcSweepAngle={220}
          rotation={250}
          backgroundWidth={4}
        >
          {() => (
            <Text style={{ color: phColor, fontSize: 48 }}>{predictedPh}</Text>
          )}
        </AnimatedCircularProgress>
      </View>
      <View style={{ width: "100%" }}>
        <Text
          style={{
            color: Colors.default.text,
            fontSize: 24,
            textAlign: "center",
          }}
        >
          Sua mistura é:
        </Text>
        <Text style={{ color: phColor, fontSize: 36, textAlign: "center" }}>
          {phLevel}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    width: "90%",
    justifyContent: "center",
    gap: 24,
  },

  buttonSave: {
    padding: 7,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: "#3d587560",
    marginTop: 20,
    width: "30%",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.default.background,
  },
  text: {
    fontSize: 24,
    color: Colors.default.text,
  },
  button: {
    backgroundColor: "#3d587560",
    padding: 10,
    borderRadius: 15,
    marginTop: 20,
    width: "30%",
    justifyContent: "center",
  },
});
