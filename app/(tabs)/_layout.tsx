import { CustomTabButton } from "@/components/CustomTabButton";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { emitCameraTakePhoto } from "@/utils/camera-events";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();

  const TAB_BAR_HEIGHT = Dimensions.get("window").height * 0.11;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => <TabBarBackground height={TAB_BAR_HEIGHT} />,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: TAB_BAR_HEIGHT,
          paddingBottom: bottom,
          backgroundColor: "transparent",
          borderWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarButton: () => {
            const isActive = pathname === "/";
            console.log(pathname);
            return (
              <CustomTabButton
                iconName={isActive ? "home" : "home-outline"}
                label="Início"
                path="/(tabs)"
                isActive={isActive}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          tabBarButton: () => {
            const isActive = pathname === "/camera";
            return (
              <View style={styles.cameraButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    if (isActive) {
                      emitCameraTakePhoto();
                    } else {
                      router.push("/camera");
                    }
                  }}
                  style={styles.cameraButton}
                >
                  <Ionicons
                    name="camera-outline"
                    size={32}
                    color={Colors.default.primary}
                  />
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarButton: () => {
            const isActive = pathname === "/history";
            return (
              <CustomTabButton
                iconName={isActive ? "time" : "time-outline"}
                label="Histórico"
                path="/history"
                isActive={isActive}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cameraButtonContainer: {
    flex: 1,
    borderColor: "transparent",
    marginTop: -30,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 40, // É melhor usar número para 'borderRadius' em vez de '%' para círculos
    backgroundColor: Colors.default.accent,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -25 }],
    shadowColor: Colors.default.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
