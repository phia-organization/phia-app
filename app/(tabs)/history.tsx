import { AlertModal } from "@/components/AlertModal";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import {
  exportMeasurements,
  importMeasurements,
} from "@/services/backupService";
import {
  deleteMeasurement,
  getAllMeasurements,
  Measurement,
} from "@/services/database";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalState {
  visible: boolean;
  itemToDelete: Measurement | null;
}

export default function History() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Carregando...");
  const [isSuccessImportData, setIsSuccessImportData] = useState({
    success: false,
    view: false,
  });
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    itemToDelete: null,
  });
  const [items, setItems] = useState<Measurement[]>([]);

  function goToDetails(item: Measurement) {
    router.push({
      pathname: "/historyDetails",
      params: {
        item: JSON.stringify(item),
      },
    });
  }

  const fetchData = useCallback(async () => {
    try {
      const data = await getAllMeasurements();
      setItems(data);
    } catch (error) {
      console.error("Erro ao buscar medições do banco de dados:", error);
    }
  }, []);

  const handleDeleteConfirm = async () => {
    if (modalState.itemToDelete) {
      await deleteItem(modalState.itemToDelete);
    }
    setModalState({ visible: false, itemToDelete: null });
  };

  async function deleteItem(itemToDelete: Measurement) {
    if (!itemToDelete.id) return;

    try {
      await deleteMeasurement(itemToDelete.id);

      await FileSystem.deleteAsync(itemToDelete.imageUri);

      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemToDelete.id)
      );
    } catch (error) {
      console.error("Erro ao deletar o registro:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleImport = async () => {
    setLoadingText("Importando Dados...");
    setIsLoading(true);
    try {
      await importMeasurements();
      fetchData();
      setIsSuccessImportData({
        success: true,
        view: true,
      });
    } catch (error) {
      console.error("A importação falhou na tela de Histórico:", error);
      setIsSuccessImportData({
        success: false,
        view: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAll = async () => {
    setLoadingText("Exportando Dados...");
    setIsLoading(true);
    try {
      await exportMeasurements(items);
    } catch (error) {
      console.error("A exportação falhou na tela de Histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText type="title">Histórico de Medições</ThemedText>
          <ThemedText style={{ color: Colors.default.textSecondary }}>
            Seus registros salvos
          </ThemedText>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleImport} style={styles.actionButton}>
            <Ionicons
              name="cloud-upload-outline"
              size={24}
              color={Colors.default.accent}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleExportAll}
            style={styles.actionButton}
          >
            <Ionicons
              name="download-outline"
              size={24}
              color={Colors.default.accent}
            />
          </TouchableOpacity>
        </View>
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
                width: "100%",
              }}
            >
              Suas medições de pH aparecerão aqui.
            </ThemedText>
          </View>
        ) : (
          items.map((item) => (
            <TouchableOpacity
              key={item.id}
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
                  <ThemedText style={styles.phValueText}>
                    {Number(item.ph).toFixed(1)}
                  </ThemedText>
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
                onPress={() =>
                  setModalState({
                    visible: true,
                    itemToDelete: item,
                  })
                }
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
      <AlertModal
        visible={modalState.visible}
        type="delete"
        title="Confirmar Exclusão"
        message="Esta ação é permanente. Tem certeza que deseja excluir este registro?"
        actions={[
          {
            text: "Cancelar",
            onPress: () =>
              setModalState({ visible: false, itemToDelete: null }),
            style: "secondary",
          },
          {
            text: "Excluir",
            onPress: handleDeleteConfirm,
            style: "destructive",
          },
        ]}
      />
      <AlertModal
        visible={isSuccessImportData.view}
        type={isSuccessImportData.success ? "success" : "error"}
        title={isSuccessImportData.success ? "Sucesso!" : "Erro!"}
        message={
          isSuccessImportData.success
            ? "Seus dados foram importados com sucesso."
            : "Ocorreu um erro inesperado ao importar seus dados."
        }
        actions={[
          {
            text: "Ver coletas",
            onPress: () => {
              setIsSuccessImportData({
                ...isSuccessImportData,
                view: false,
              });
            },
            style: "primary",
          },
        ]}
      />
      <LoadingOverlay visible={isLoading} text={loadingText} />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
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
