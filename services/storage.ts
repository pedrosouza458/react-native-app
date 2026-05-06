import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const uploadImage = async (uri: string, uid: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `profile_pictures/${uid}/avatar.jpg`);

  await uploadBytes(storageRef, blob);

  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
