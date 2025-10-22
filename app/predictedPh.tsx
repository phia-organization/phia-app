import { ThemedText } from "@/components/ThemedText";
import { Colors, pHValueColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* export function getPhLevel(valor: number): {
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
 */

export function getPhLevelFromInterval(interval: string): {
  phLevel: string;
  phColor: string;
} {
  const phIntervalMap: { [key: string]: { phLevel: string; phColor: string } } =
    {
      "2.50 - 4.00": {
        phLevel: "Ácido Moderado",
        phColor: pHValueColors["Ácido Moderado"],
      },
      "4.00 - 5.50": {
        phLevel: "Ácido Moderado",
        phColor: pHValueColors["Ácido Moderado"],
      },
      "5.50 - 7.00": {
        phLevel: "Ácido Leve",
        phColor: pHValueColors["Ácido Leve"],
      },
      "7.00 - 8.50": {
        phLevel: "Base Leve",
        phColor: pHValueColors["Base Leve"],
      },
      "8.50 - 10.00": {
        phLevel: "Base Moderada",
        phColor: pHValueColors["Base Moderada"],
      },
      "10.00 - 11.50": {
        phLevel: "Base Moderada",
        phColor: pHValueColors["Base Moderada"],
      },
      "11.50 - 13.00": {
        phLevel: "Base Forte",
        phColor: pHValueColors["Base Forte"],
      },
    };

  return (
    phIntervalMap[interval] || {
      phLevel: "Indefinido",
      phColor: Colors.default.textSecondary,
    }
  );
}

export default function PredictedPh() {
  const params = useLocalSearchParams<{ apiResponse: string }>();
  const { top } = useSafeAreaInsets();

  const analysisData = useMemo(() => {
    try {
      if (!params.apiResponse) return null;
      const response = JSON.parse(params.apiResponse);
      const phInterval = response.predicted_ph_interval;

      const { phLevel, phColor } = getPhLevelFromInterval(phInterval);

      const [start, end] = phInterval.split(" - ").map(parseFloat);
      const midpointValue = (start + end) / 2;
      const phPercentage = (midpointValue / 14) * 100;

      return {
        phInterval,
        phLevel,
        phColor,
        phPercentage,
        rgbs: response.rgbs,
      };
    } catch (error) {
      console.error("Falha ao analisar os dados da análise:", error);
      return null;
    }
  }, [params.apiResponse]);

  if (!analysisData) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.header,
            {
              paddingTop: top,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.default.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <ThemedText type="title">Erro na Análise</ThemedText>
          <ThemedText style={{ marginTop: 16 }}>
            Não foi possível carregar os resultados. Por favor, tente novamente.
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const { phInterval, phLevel, phColor, phPercentage } = analysisData;

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: top,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.default.text} />
        </TouchableOpacity>
        <ThemedText type="title" style={{ color: Colors.default.text }}>
          Resultado da Análise
        </ThemedText>
      </View>

      <View style={styles.content}>
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
              {phInterval}
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
              params: {
                phInterval,
                phColor,
                phLevel,
              },
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
    display: "flex",
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors.default.primary,
    width: "100%",
    paddingLeft: 16,
    paddingBottom: 12,
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
    fontSize: 30,
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
    backgroundColor: Colors.default.primary,
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
