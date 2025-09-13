import { exportMeasurements } from "@/services/backupService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

type HistoryItem = {
  date: string;
  ph: number;
  phLevel: string;
  phColor: string;
  title: string;
  description: string;
  location: string;
  user: string;
  imageUri: string;
};

export default function HistoryDetails() {
  const { item } = useLocalSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

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

  const handleExportOne = async () => {
    if (parsedItem) {
      setIsLoading(true);
      try {
        await exportMeasurements([parsedItem]);
      } catch (error) {
        console.error("A exportação falhou na tela de Detalhes:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!parsedItem) {
    return (
      <View style={styles.container}>
        <ThemedText type="defaultSemiBold">
          Item não encontrado ou inválido.
        </ThemedText>
      </View>
    );
  }

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <View style={styles.infoRow}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={Colors.default.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.infoLabel}>{label}</ThemedText>
        <ThemedText style={styles.infoValue}>{value}</ThemedText>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.default.text} />
        </TouchableOpacity>
        <ThemedText
          type="subtitle"
          style={styles.headerTitle}
          numberOfLines={1}
        >
          {parsedItem.title || "Detalhes da Medição"}
        </ThemedText>
        <TouchableOpacity onPress={handleExportOne} style={styles.exportButton}>
          <Ionicons
            name="download-outline"
            size={24}
            color={Colors.default.accent}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.resultsCard}>
          <View
            style={{
              width: "100%",
            }}
          >
            <ThemedText
              style={{
                ...styles.headerTitle,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {parsedItem.title || "Medição sem título"}
            </ThemedText>
            <ThemedText style={{ ...styles.resultsLabel, textAlign: "center" }}>
              Valor do pH
            </ThemedText>
            <ThemedText style={{ ...styles.resultsValue, textAlign: "center" }}>
              {Number(parsedItem.ph).toFixed(1)}
            </ThemedText>
          </View>
          <View
            style={[styles.levelBadge, { backgroundColor: parsedItem.phColor }]}
          >
            <ThemedText style={styles.levelBadgeText}>
              {parsedItem.phLevel}
            </ThemedText>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <InfoRow
            icon="calendar-outline"
            label="Data da Medição"
            value={new Date(parsedItem.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="location-outline"
            label="Local"
            value={parsedItem.location}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="person-outline"
            label="Usuário"
            value={parsedItem.user}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="document-text-outline"
            label="Descrição"
            value={parsedItem.description}
          />
        </View>

        <View style={styles.imageCard}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
              gap: 14,
            }}
          >
            <Ionicons
              name={"camera-outline"}
              size={20}
              color={Colors.default.accent}
            />
            <ThemedText style={styles.imageCardTitle}>
              Fita de pH Registrada
            </ThemedText>
          </View>

          <Image
            source={{ uri: parsedItem.imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} text={"Exportando Coleta..."} />
    </View>
  );
}

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
  headerTitle: {
    fontSize: 20,
    flex: 1,
    marginHorizontal: 8,
  },
  exportButton: {
    padding: 8,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  resultsCard: {
    backgroundColor: Colors.default.card,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  resultsLabel: {
    color: Colors.default.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  resultsValue: {
    fontFamily: "SpaceMono",
    fontSize: 56,
    color: Colors.default.accent,
    fontWeight: "bold",
  },
  levelBadge: {
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  levelBadgeText: {
    color: Colors.default.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsCard: {
    backgroundColor: Colors.default.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  iconContainer: {
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.default.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.default.text,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 8,
  },
  imageCard: {
    backgroundColor: Colors.default.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 40,
  },
  imageCardTitle: {
    color: Colors.default.textSecondary,
    fontSize: 12,
  },
  image: {
    width: "100%",
    aspectRatio: 9 / 12,
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: Colors.default.background,
  },
});
