import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { getLastMeasurement, Measurement } from "@/services/database";

const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.infoCard}>
    <View style={styles.infoCardHeader}>
      <Ionicons name={icon} size={20} color={Colors.default.accent} />
      <ThemedText type="subtitle" style={styles.infoCardTitle}>
        {title}
      </ThemedText>
    </View>
    <ThemedText style={styles.infoCardText}>{children}</ThemedText>
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const [lastMeasurement, setLastMeasurement] = useState<Measurement | null>(
    null
  );

  useFocusEffect(
    useCallback(() => {
      const fetchLastMeasurement = async () => {
        const data = await getLastMeasurement();
        if (data) {
          setLastMeasurement(data);
        }
      };
      fetchLastMeasurement();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/favicon.png")}
          style={styles.logo}
        />
        <ThemedText type="title" style={styles.headerTitle}>
          pHIA
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ marginBottom: 24, width: "100%" }}>
          {/*  <Image
            source={require("@/assets/images/hero.jpeg")}
            style={{
              width: "100%",
              height: 250,
              resizeMode: "cover",
              borderRadius: 12,
            }}
          /> */}
        </View>
        <ThemedText style={styles.welcomeText}>
          A análise de pH na palma da sua mão.
        </ThemedText>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push("/camera")}
        >
          <Ionicons
            name="camera-outline"
            size={24}
            color={Colors.default.primary}
          />
          <Text style={styles.ctaButtonText}>Nova Medição</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Último Registro
          </ThemedText>
          {lastMeasurement ? (
            <View style={styles.recentCard}>
              <View
                style={[
                  styles.colorIndicator,
                  { backgroundColor: lastMeasurement.phColor },
                ]}
              />
              <View style={styles.recentCardContent}>
                <ThemedText style={styles.recentCardTitle} numberOfLines={1}>
                  {lastMeasurement.title}
                </ThemedText>
                <ThemedText
                  style={{ color: Colors.default.textSecondary, fontSize: 12 }}
                >
                  {new Date(lastMeasurement.date).toLocaleDateString("pt-BR")}
                </ThemedText>
              </View>
              <View style={styles.phValueContainer}>
                <ThemedText style={styles.phValueText}>
                  {Number(lastMeasurement.ph).toFixed(1)}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.phLevelText,
                    { color: lastMeasurement.phColor },
                  ]}
                >
                  {lastMeasurement.phLevel}
                </ThemedText>
              </View>
            </View>
          ) : (
            <View style={styles.emptyRecentCard}>
              <ThemedText
                style={{
                  color: Colors.default.textSecondary,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Nenhuma medição ainda.
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Conheça o Projeto
          </ThemedText>
          <InfoCard icon="heart-outline" title="Motivação">
            Medir o pH é essencial, mas os métodos atuais são imprecisos para
            leitura visual ou muito caros. O pHIA torna a análise precisa e
            acessível para todos.
          </InfoCard>
          <InfoCard icon="bulb-outline" title="A Ideia">
            Utilizamos a câmera do seu celular e Inteligência Artificial para
            analisar fitas de pH, oferecendo resultados confiáveis e de baixo
            custo.
          </InfoCard>
          <InfoCard icon="rocket-outline" title="Objetivo">
            Desenvolver um app inclusivo que interpreta as cores das fitas com
            precisão, auxiliando estudantes, agricultores e profissionais.
          </InfoCard>
          <InfoCard icon="bar-chart-outline" title="Nossa Escala">
            Para garantir a máxima precisão, criamos e validamos uma escala de
            referência própria, calibrada com um pHmetro profissional, que
            treina nosso sistema.
          </InfoCard>
        </View>
      </ScrollView>
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
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.default.primary,
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.default.textSecondary,
    marginBottom: 24,
  },
  ctaButton: {
    flexDirection: "row",
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
  ctaButtonText: {
    color: Colors.default.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginTop: 32,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  recentCard: {
    backgroundColor: Colors.default.card,
    borderRadius: 12,
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
  recentCardContent: {
    flex: 1,
    padding: 16,
  },
  recentCardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyRecentCard: {
    backgroundColor: Colors.default.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  infoCard: {
    backgroundColor: Colors.default.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 8,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoCardTitle: {
    fontSize: 16,
  },
  infoCardText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.default.textSecondary,
  },
  phValueContainer: {
    alignItems: "flex-end",
    paddingRight: 18,
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
});
