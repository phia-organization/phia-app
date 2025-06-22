import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, pHValueColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

export default function History() {
  const router = useRouter();

  const items = [
    {
      id: "1",
      image: "@/assets/images/ph-strip.png",
      createdAt: "2024-06-01T00:00:00.000Z",
      value: 4.5,
      level: "Ácido Moderado",
      description: "Descrição do item 1",
      location: "Local 1",
      user: "Usuário da Silva",
    },
    {
      id: "2",
      image: "@/assets/images/ph-strip.png",
      createdAt: "2024-06-02T00:00:00.000Z",
      value: 8.5,
      level: "Base Forte",
      description: "Descrição do item 2",
      location: "Local 2",
      user: "Usuário da Silva",
    },
    {
      id: "3",
      image: "@/assets/images/ph-strip.png",
      createdAt: "2024-06-03T00:00:00.000Z",
      value: 1.1,
      level: "Ácido Forte",
      description: "Descrição do item 3",
      location: "Local 3",
      user: "Usuário da Silva",
    },
  ];

  function goToDetails(item: any) {
    router.push({
      pathname: "/historyDetails",
      params: {
        item: JSON.stringify(item),
      },
    });
  }

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Histórico</ThemedText>
      </ThemedView>

      <ThemedText type="defaultSemiBold" style={{ textAlign: "center" }}>
        Esta é a aba de histórico, onde você pode ver suas interações passadas.
      </ThemedText>

      {items.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => goToDetails(item)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.default.card,
            borderRadius: 12,
            padding: 12,
            marginVertical: 6,
            width: "100%",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View style={{ marginRight: 12 }}>
            <Image
              source={require("@/assets/images/ph-strip.png")}
              alt="history"
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText
              type="default"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: 12,
              }}
            >
              Data do Registro:{" "}
              {new Date(item.createdAt).toLocaleDateString("pt-BR")}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>
              Valor do pH: {item.value}
            </ThemedText>
            <ThemedText
              type="default"
              style={{
                fontSize: 13,
              }}
            >
              Força:{" "}
              <ThemedText
                type="defaultSemiBold"
                style={{
                  fontSize: 13,
                  color:
                    pHValueColors[item.level as keyof typeof pHValueColors] ||
                    Colors.default.text,
                }}
              >
                {item.level}
              </ThemedText>
            </ThemedText>
          </View>
          <View
            style={{
              height: "100%",
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                backgroundColor: Colors.default.error,
                padding: 3,
                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  // Handle delete action
                  console.log(`Delete item with value: ${item.value}`);
                }}
              >
                <Ionicons name="trash-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    backgroundColor: Colors.default.background,
    padding: 16,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    marginTop: Dimensions.get("window").height * 0.035,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: Colors.default.primary,
    gap: 8,
  },
});
