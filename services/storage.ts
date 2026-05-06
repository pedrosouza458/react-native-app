import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const uploadImage = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `images/photo_${Date.now()}.jpg`);

  await uploadBytes(storageRef, blob);

  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
