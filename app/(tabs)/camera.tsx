import { Dimensions, StyleSheet, View } from 'react-native';

import CameraComponent from '@/components/camera/CameraComponent';
import CameraFrameOverlay from '@/components/camera/CameraFrameOverlay';
import CameraInstructionsOverlay from '@/components/camera/CameraInstructionsOverlay';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Portal } from 'react-native-paper';

export default function TabTwoScreen() {
  const [alertVisible, setAlertVisible] = React.useState(true);

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Câmera</ThemedText>
      </ThemedView>

      {alertVisible && (
        <Portal>
          <CameraInstructionsOverlay
            onConfirm={() => setAlertVisible(false)}
            onDontShowAgain={() => setAlertVisible(false)}
          />
        </Portal>
      )}

      {!alertVisible && (
        <>
          <CameraComponent />
          <CameraFrameOverlay />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.default.background,
  },
  titleContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.01,
    left: '50%',
    transform: [{ translateX: '-50%' }],
    width: 'auto',
    flexDirection: 'row',
    paddingVertical: 10,
    marginTop: Dimensions.get('window').height * 0.035,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: Colors.default.primary,
    gap: 8,
    zIndex: 10,
  },
});
