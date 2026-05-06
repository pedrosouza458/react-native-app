import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const usePhoto = () => {
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need camera access permission");
      return null;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) return result.assets[0].uri;
    return null;
  };
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need gallery acess permission");
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) return result.assets[0].uri;
    return null;
  };
  return { takePhoto, pickFromGallery };
};
