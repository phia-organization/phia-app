import { Image } from "expo-image";
import { ScrollView, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#0B1525", dark: "#0B1525" }}
      headerImage={
        <Image
          source={require("@/assets/images/adaptive-phia-icon.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Projeto pHIA</ThemedText>
      </ThemedView>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <ThemedText type="subtitle">🌱 Motivação</ThemedText>
          <ThemedText>
            Medir o pH de soluções é uma prática essencial em áreas como
            educação, agricultura, saúde, indústria e meio ambiente. Apesar da
            praticidade das fitas indicadoras, sua leitura visual é limitada,
            imprecisa e excludente para pessoas com daltonismo. Já os pHmetros
            digitais são caros e pouco acessíveis em escolas e pequenos
            laboratórios.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">💡 A Ideia</ThemedText>
          <ThemedText>
            O pHIA surge como uma solução acessível e inclusiva: um aplicativo
            móvel que utiliza a câmera do celular e inteligência artificial para
            analisar a coloração das fitas de pH e fornecer resultados mais
            precisos. Dessa forma, democratizamos o acesso a análises
            confiáveis, unindo baixo custo e praticidade.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">🎯 Objetivo</ThemedText>
          <ThemedText>
            O objetivo principal é desenvolver um app multiplataforma (Android e
            iOS), baseado em React Native e Python, capaz de:
            {"\n"}• Interpretar com precisão a cor das fitas por IA;
            {"\n"}• Oferecer resultados confiáveis mesmo em diferentes condições
            de iluminação;
            {"\n"}• Tornar o processo inclusivo para pessoas com daltonismo;
            {"\n"}• Ampliar o uso em contextos educacionais, agrícolas e
            clínicos.
          </ThemedText>
        </View>
        <View style={styles.section}>
          <ThemedText type="subtitle">🔬 Escala de Referência</ThemedText>
          <ThemedText>
            Durante os testes iniciais, percebemos que a escala fornecida nas
            embalagens das fitas não correspondia aos valores reais. Por isso,
            construímos nossa própria escala de calibração, utilizando um
            pHmetro como referência para treinar e validar o sistema.
          </ThemedText>
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
