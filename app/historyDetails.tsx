import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
/* 
type PHLevel =
  | "Ácido Forte"
  | "Ácido Moderado"
  | "Ácido Leve"
  | "Base Leve"
  | "Base Moderada"
  | "Base Forte";
 */
type HistoryItem = {
  date: string;
  ph: number;
  phLevel: string;
  phColor: string;
  description: string;
  location: string;
  user: string;
};

export default function HistoryDetails() {
  const { item } = useLocalSearchParams();

  const parsedItem: HistoryItem | null = useMemo(() => {
    try {
      if (!item) return null;
      const itemStr = Array.isArray(item) ? item[0] : item;
      return JSON.parse(itemStr);
    } catch (err) {
      console.error("Erro ao parsear item:", err);
      return null;
    }
  }, [item]);

  if (!parsedItem) {
    return (
      <View style={styles.container}>
        <ThemedText type="defaultSemiBold">
          Item não encontrado ou inválido.
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <Text style={{ ...styles.title, color: parsedItem.phColor }}>
          {parsedItem.phLevel}
        </Text>
      </ThemedView>
      <Image
        source={require("@/assets/images/ph-strip.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.highlightBox}>
        <Text style={styles.valueText}>Valor do pH: {parsedItem.ph}</Text>
        <Text style={styles.dateText}>
          {new Date(parsedItem.date).toLocaleDateString("pt-BR")}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text
          style={{
            color: Colors.default.tint,
            fontWeight: "bold",
          }}
        >
          Local:{" "}
        </Text>
        <Text
          style={{
            color: Colors.default.tint,
            fontWeight: "light",
          }}
        >
          {parsedItem.location}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text
          style={{
            fontWeight: "bold",
            color: Colors.default.tint,
          }}
        >
          Usuário:{" "}
        </Text>
        <Text
          style={{
            color: Colors.default.tint,
            fontWeight: "light",
          }}
        >
          {parsedItem.user}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text
          style={{
            fontWeight: "bold",
            color: Colors.default.tint,
          }}
        >
          Descrição:
        </Text>
        <Text
          style={{
            color: Colors.default.tint,
            fontWeight: "light",
          }}
        >
          {parsedItem.description}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.default.background,
    alignItems: "center",
    gap: 24,
    height: "100%",
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: Colors.default.primary,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
  },
  image: {
    width: "100%",
    height: Dimensions.get("window").height * 0.3,
    borderRadius: 20,
    marginBottom: 10,
  },
  highlightBox: {
    backgroundColor: Colors.default.card,
    borderRadius: 16,
    padding: 16,
    width: "100%",
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  levelText: {
    fontSize: 18,
    color: Colors.default.tint,
  },
  valueText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  dateText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  infoBox: {
    backgroundColor: Colors.default.card,
    borderRadius: 12,
    padding: 16,
    width: "100%",
    gap: 4,
    display: "flex",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
});
