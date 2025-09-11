import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CustomTabButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  path: string;
  isActive: boolean;
}

export const CustomTabButton = ({
  iconName,
  label,
  path,
  isActive,
}: CustomTabButtonProps) => {
  const router = useRouter();

  const activeColor = Colors.default.accent;
  const inactiveColor = Colors.default.textSecondary;
  const color = isActive ? activeColor : inactiveColor;

  return (
    <TouchableOpacity
      onPress={() => router.push(path as any)}
      style={styles.container}
    >
      <Ionicons name={iconName} size={24} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
  },
});
