import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const PhotoPreviewSection = ({
  photo,
  handleRetakePhoto,
}: {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
}) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.box}>
      <Image
        style={styles.previewConatiner}
        source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
      />
    </View>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
        <Fontisto name="trash" size={36} color="black" />
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    borderRadius: 15,
    padding: 1,
    width: '100%',
    backgroundColor: '#0B1525',
    justifyContent: 'center',
    alignItems: 'center',
    top: '-4%',
  },
  previewConatiner: {
    width: '95%',
    height: '90%',
    borderRadius: 15,
  },
  buttonContainer: {
    marginTop: '4%',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0.15,
    left: Dimensions.get('window').width * 0.4,
    width: '100%',
  },
  button: {
    backgroundColor: 'gray',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PhotoPreviewSection;
