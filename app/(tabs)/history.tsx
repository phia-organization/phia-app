import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
// CERTIFIQUE-SE DE QUE ESTE ARQUIVO CONTÉM A NOVA PALETA
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function History() {
  const router = useRouter();

  const [items, setItems] = React.useState<
    {
      date: string;
      title: string;
      description: string;
      location: string;
      ph: number;
      phColor: string;
      phLevel: string;
      user: string;
    }[]
  >([]);

  function goToDetails(item: any) {
    router.push({
      pathname: "/historyDetails",
      params: {
        item: JSON.stringify(item),
      },
    });
  }

  async function deleteItem(dateToDelete: string) {
    const data = await AsyncStorage.getItem("phRecords");
    if (data) {
      const parsedData = JSON.parse(data);
      const filteredData = parsedData.filter(
        (record: any) => record.date !== dateToDelete
      );
      await AsyncStorage.setItem("phRecords", JSON.stringify(filteredData));
      setItems(filteredData);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await AsyncStorage.getItem("phRecords");
      if (data) {
        const parsedData = JSON.parse(data).sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setItems(parsedData);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Histórico de Medições</ThemedText>
        <ThemedText style={{ color: Colors.default.textSecondary }}>
          Seus registros salvos
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="archive-outline"
              size={48}
              color={Colors.default.textSecondary}
            />
            <ThemedText type="subtitle">Nenhum registro</ThemedText>
            <ThemedText
              style={{
                color: Colors.default.textSecondary,
                textAlign: "center",
              }}
            >
              Suas medições de pH aparecerão aqui.
            </ThemedText>
          </View>
        ) : (
          items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => goToDetails(item)}
              style={styles.card}
            >
              <View
                style={[
                  styles.colorIndicator,
                  {
                    backgroundColor:
                      item.phColor || Colors.default.textSecondary,
                  },
                ]}
              />

              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="subtitle" numberOfLines={1}>
                    {item.title || "Medição sem título"}
                  </ThemedText>
                  <ThemedText
                    style={{
                      color: Colors.default.textSecondary,
                      fontSize: 12,
                    }}
                  >
                    {new Date(item.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </ThemedText>
                </View>

                <View style={styles.phValueContainer}>
                  <ThemedText style={styles.phValueText}>{item.ph}</ThemedText>
                  <ThemedText
                    style={[styles.phLevelText, { color: item.phColor }]}
                  >
                    {item.phLevel}
                  </ThemedText>
                </View>
              </View>

              <View
                style={{
                  height: "60%",
                  width: 1,
                  backgroundColor: Colors.default.textSecondary,
                  marginRight: -3,
                  marginLeft: 4,
                }}
              />

              <TouchableOpacity
                onPress={() => deleteItem(item.date)}
                style={styles.deleteButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={Colors.default.textSecondary}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.default.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.default.primary,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Dimensions.get("window").height * 0.2,
    gap: 8,
  },
  card: {
    backgroundColor: Colors.default.card,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  colorIndicator: {
    width: 6,
    height: "100%",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  phValueContainer: {
    alignItems: "flex-end",
  },
  phValueText: {
    fontFamily: "SpaceMono",
    fontSize: 22,
    color: Colors.default.accent,
    fontWeight: "bold",
  },
  phLevelText: {
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
