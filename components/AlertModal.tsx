import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

type AlertType = "success" | "error" | "warning" | "info";

interface ActionButton {
  text: string;
  onPress: () => void;
  style?: "primary" | "destructive" | "secondary";
}

interface AlertModalProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  actions: ActionButton[];
}

export const AlertModal = ({
  visible,
  type,
  title,
  message,
  actions,
}: AlertModalProps) => {
  const config = useMemo(() => {
    switch (type) {
      case "success":
        return {
          icon: "checkmark-circle" as const,
          color: Colors.default.success,
        };
      case "error":
        return { icon: "close-circle" as const, color: Colors.default.error };
      case "warning":
        return { icon: "warning" as const, color: Colors.default.warning };
      case "info":
      default:
        return {
          icon: "information-circle" as const,
          color: Colors.default.accent,
        };
    }
  }, [type]);

  const getButtonStyle = (style?: "primary" | "destructive" | "secondary") => {
    switch (style) {
      case "destructive":
        return styles.destructiveButton;
      case "secondary":
        return styles.secondaryButton;
      case "primary":
      default:
        return styles.primaryButton;
    }
  };

  const getButtonTextStyle = (
    style?: "primary" | "destructive" | "secondary"
  ) => {
    switch (style) {
      case "destructive":
        return styles.destructiveButtonText;
      case "secondary":
        return styles.secondaryButtonText;
      case "primary":
      default:
        return styles.primaryButtonText;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        const cancelAction = actions.find((a) => a.style === "secondary");
        if (cancelAction) {
          cancelAction.onPress();
        } else if (actions.length > 0) {
          actions[0].onPress();
        }
      }}
    >
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalContent, { borderColor: config.color }]}>
          <View style={styles.iconContainer}>
            <Ionicons name={config.icon} size={64} color={config.color} />
          </View>

          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>

          <View style={styles.buttonContainer}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.buttonBase, getButtonStyle(action.style)]}
                onPress={action.onPress}
              >
                <Text style={getButtonTextStyle(action.style)}>
                  {action.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: Colors.default.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderTopWidth: 4,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: Colors.default.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: Colors.default.accent,
  },
  primaryButtonText: {
    color: Colors.default.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  destructiveButton: {
    backgroundColor: Colors.default.error,
  },
  destructiveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: Colors.default.background,
  },
  secondaryButtonText: {
    color: Colors.default.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
