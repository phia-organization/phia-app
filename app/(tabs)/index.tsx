import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

type InfoCardProps = {
  icon: string;
  title: string;
  children: React.ReactNode;
};

const InfoCard = ({ icon, title, children }: InfoCardProps) => {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.cardIconCircle}>
        <ThemedText style={styles.cardIcon}>{icon}</ThemedText>
      </View>
      <ThemedText type="subtitle" style={styles.cardTitle}>
        {title}
      </ThemedText>
      <ThemedText style={styles.cardText}>{children}</ThemedText>
    </ThemedView>
  );
};

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.default.primary }}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/favicon.png")}
          style={styles.logo}
          width={100}
          height={100}
          alt="pHIA Logo"
        />
        <ThemedText type="title" style={styles.headerTitle}>
          pHIA
        </ThemedText>
      </View>
      <LinearGradient
        colors={["#3a4450", "#5c6a82"]}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        {/* Seção de Título/Boas-vindas */}
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="defaultSemiBold" style={styles.tagline}>
            A análise de pH na palma da sua mão.
          </ThemedText>
        </ThemedView>

        {/* Container principal para os cards */}
        <View style={styles.contentContainer}>
          <InfoCard icon="🌱" title="Motivação">
            Medir o pH é essencial, mas os métodos atuais são imprecisos para
            leitura visual ou muito caros. O pHIA torna a análise precisa e
            acessível para todos.
          </InfoCard>

          <InfoCard icon="💡" title="A Ideia">
            Utilizamos a câmera do seu celular e Inteligência Artificial para
            analisar fitas de pH, oferecendo resultados confiáveis, de baixo
            custo e de forma prática.
          </InfoCard>

          <InfoCard icon="🎯" title="Objetivo">
            Desenvolver um app inclusivo (Android e iOS) que interpreta as cores
            das fitas com precisão, mesmo com variações de luz, auxiliando
            estudantes, agricultores e profissionais.
          </InfoCard>

          <InfoCard icon="🔬" title="Nossa Escala">
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
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  scrollView: {
    backgroundColor: Colors.default.background,
    marginTop: 80,
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  tagline: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.default.text,
    letterSpacing: 0.2,
  },
  contentContainer: {
    padding: 20,
    gap: 20,
    paddingBottom: 120,
  },
  logo: {
    width: 64,
    height: 64,
    resizeMode: "contain",
    marginBottom: 0,
  },
  header: {
    backgroundColor: "transparent",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: -60,
    gap: 1,
  },
  headerTitle: {
    fontSize: 44,
    fontWeight: "bold",
    color: Colors.default.text,
    letterSpacing: 1,
    lineHeight: 60,
  },
  card: {
    padding: 22,
    borderRadius: 18,
    gap: 10,
    backgroundColor: "#313a42ff",
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    // Sombra para Android
    elevation: 4,
    borderWidth: 1,
  },
  cardIconCircle: {
    backgroundColor: Colors.default.background,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    alignSelf: "flex-start",
  },
  cardIcon: {
    fontSize: 28,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.default.text,
    marginBottom: 2,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.92,
    color: Colors.default.text,
  },
});
