import { usePhoto } from "@/hooks/usePhoto";
import { signUp } from "@/services/auth";
import { uploadImage } from "@/services/storage";
import { Link, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const { takePhoto, pickFromGallery } = usePhoto();
  const router = useRouter();

  const db = useSQLiteContext();

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) setPhotoUri(uri);
  };

  const handlePickFromGallery = async () => {
    const uri = await pickFromGallery();
    if (uri) setPhotoUri(uri);
  };

  const handleRegister = async () => {
    try {
      const firebaseUser = await signUp(email, password);

      let remotePhotoUrl = null;

      if (photoUri) {
        remotePhotoUrl = await uploadImage(photoUri, firebaseUser.uid);
      }

      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: photoUri,
      });

      await db.runAsync(
        "INSERT INTO users (id, name, email, profile_picture) VALUES (?, ?, ?, ?)",
        [firebaseUser.uid, name, email, remotePhotoUrl],
      );
      alert("Account created");
      router.replace("/");
    } catch (error) {
      alert("Error creating account: " + error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Container>
        <Title>Register Account</Title>
        <AvatarPreview
          source={{ uri: photoUri || "https://via.placeholder.com/100" }}
        />
        <PhotoActionContainer>
          <SecondaryButton onPress={handleTakePhoto}>
            <SecondaryButtonText>📷 Camera</SecondaryButtonText>
          </SecondaryButton>
          <SecondaryButton onPress={handlePickFromGallery}>
            <SecondaryButtonText>🖼️ Gallery</SecondaryButtonText>
          </SecondaryButton>
        </PhotoActionContainer>
        <Input
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <StyledButton onPress={handleRegister}>
          <ButtonText>Register</ButtonText>
        </StyledButton>
        <RedirectText>
          Already have a account? <Link href="/(auth)">Sign on</Link>
        </RedirectText>
      </Container>
    </TouchableWithoutFeedback>
  );
}

export const AvatarPreview = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  align-self: center;
  margin-bottom: 15px;
  background-color: #e1e1e1;
`;

export const PhotoActionContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 20px;
`;

export const SecondaryButton = styled.TouchableOpacity`
  background-color: #e5e5ea;
  padding: 10px 15px;
  border-radius: 8px;
  align-items: center;
  flex: 0.48;
`;

export const SecondaryButtonText = styled.Text`
  color: #007aff;
  font-size: 14px;
  font-weight: 600;
`;

export const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

export const RegisterButton = styled.Button`
 background-color: #007aff,
 color: #fff
 `;

const StyledButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

export const RedirectText = styled.Text`
  text-align: center;
  margin-top: 6px;
`;
