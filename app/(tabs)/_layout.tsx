import { Tabs, usePathname, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.default.tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {
              position: "absolute",
              backgroundColor: "transparent",
              borderTopWidth: 0,
              elevation: 0,
              height: 90,
            },
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Início",
            tabBarButton: () => {
              const isActive =
                pathname === "/home" ||
                pathname === "/" ||
                pathname === "/(tabs)";
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push("/(tabs)");
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 10,
                  }}
                >
                  <Ionicons
                    name="home"
                    size={30}
                    color={isActive ? "white" : "gray"}
                  />
                  <Text
                    style={{
                      color: isActive ? "white" : "gray",
                      fontSize: 12,
                      textAlign: "center",
                      width: 60,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Início
                  </Text>
                </TouchableOpacity>
              );
            },
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: "Câmera",
            tabBarButton: () => {
              const isActive = pathname === "/camera";
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push("/camera");
                  }}
                  style={[
                    styles.absoluteButton,
                    isActive && {
                      backgroundColor: "#f33",
                      borderWidth: 2,
                      borderColor: "#fff",
                    },
                  ]}
                >
                  <Ionicons
                    name="scan-circle-outline"
                    size={60}
                    color={isActive ? "#fff" : "#f33"}
                  />
                </TouchableOpacity>
              );
            },
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "Histórico",
            tabBarButton: () => {
              const isActive = pathname === "/history";
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push("/history");
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 10,
                  }}
                >
                  <Ionicons
                    name="time"
                    size={30}
                    color={isActive ? "white" : "gray"}
                  />
                  <Text
                    style={{
                      color: isActive ? "white" : "gray",
                      fontSize: 12,
                      textAlign: "center",
                      width: 60,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Histórico
                  </Text>
                </TouchableOpacity>
              );
            },
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  absoluteButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.045,
    left: "50%",
    transform: [{ translateX: -38 }],
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#0B1525",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
