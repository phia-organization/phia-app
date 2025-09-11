import { ThemedText } from "@/components/ThemedText";
import { Colors, pHValueColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export function getPhLevel(valor: number): {
  phLevel: string;
  phColor: string;
} {
  if (valor >= 0 && valor < 2)
    return { phLevel: "Ácido Forte", phColor: pHValueColors["Ácido Forte"] };
  if (valor >= 2 && valor < 5)
    return {
      phLevel: "Ácido Moderado",
      phColor: pHValueColors["Ácido Moderado"],
    };
  if (valor >= 5 && valor < 7)
    return { phLevel: "Ácido Leve", phColor: pHValueColors["Ácido Leve"] };
  if (valor >= 7 && valor < 8)
    return { phLevel: "Base Leve", phColor: pHValueColors["Base Leve"] };
  if (valor >= 8 && valor < 11)
    return {
      phLevel: "Base Moderada",
      phColor: pHValueColors["Base Moderada"],
    };
  if (valor >= 11 && valor <= 14)
    return { phLevel: "Base Forte", phColor: pHValueColors["Base Forte"] };
  return { phLevel: "Indefinido", phColor: Colors.default.textSecondary };
}

export default function PredictedPh() {
  const [predictedPh, setPredictedPh] = useState<number | null>(null);
  const [phColor, setPhColor] = useState<string>(Colors.default.textSecondary);
  const [phLevel, setPhLevel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPredictedPh = async () => {
      try {
        const phData = await AsyncStorage.getItem("ph_predictions");
        if (phData !== null) {
          const parsedPredictions = JSON.parse(phData);
          const lastPrediction =
            parsedPredictions[parsedPredictions.length - 1];

          if (lastPrediction && lastPrediction.predicted_ph !== undefined) {
            const phValue = lastPrediction.predicted_ph;
            const { phLevel, phColor } = getPhLevel(phValue);
            setPredictedPh(phValue);
            setPhLevel(phLevel);
            setPhColor(phColor);
          }
        }
      } catch (e) {
        console.error("Erro ao ler o valor de pH:", e);
      } finally {
        setIsLoading(false);
      }
    };

    getPredictedPh();
  }, []);

  const phPercentage = predictedPh ? (predictedPh / 14) * 100 : 0;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.default.accent} />
        <ThemedText
          style={{ color: Colors.default.textSecondary, marginTop: 16 }}
        >
          Analisando resultado...
        </ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.default.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ThemedText type="title">Resultado da Análise</ThemedText>

        <AnimatedCircularProgress
          size={220}
          width={15}
          fill={phPercentage}
          tintColor={phColor}
          backgroundColor={Colors.default.card}
          lineCap="round"
          arcSweepAngle={240}
          rotation={240}
          style={{ marginVertical: 32 }}
        >
          {() => (
            <Text style={[styles.phValueText, { color: phColor }]}>
              {predictedPh?.toFixed(1)}
            </Text>
          )}
        </AnimatedCircularProgress>

        <View style={styles.levelContainer}>
          <ThemedText style={styles.levelLabel}>Sua amostra é:</ThemedText>
          <ThemedText style={[styles.levelText, { color: phColor }]}>
            {phLevel}
          </ThemedText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.discardButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="close-outline"
            size={22}
            color={Colors.default.textSecondary}
          />
          <Text style={styles.discardButtonText}>Descartar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() =>
            router.push({
              pathname: "/savePh",
              params: { ph: predictedPh?.toString(), phColor, phLevel },
            })
          }
        >
          <Ionicons
            name="save-outline"
            size={22}
            color={Colors.default.primary}
          />
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.default.background,
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    paddingLeft: 16,
    paddingTop: 40,
    alignItems: "flex-start",
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  phValueText: {
    fontFamily: "SpaceMono",
    fontSize: 52,
    fontWeight: "bold",
  },
  levelContainer: {
    width: "100%",
    gap: 4,
  },
  levelLabel: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.default.textSecondary,
  },
  levelText: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    padding: 20,
    paddingBottom: 40,
    gap: 10,
  },
  discardButton: {
    flex: 1,
    flexDirection: "row",
    maxWidth: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.default.card,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    elevation: 8,
  },
  discardButtonText: {
    color: Colors.default.text,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    maxWidth: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.default.accent,
    paddingVertical: 16,
    borderRadius: 12,
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
});
