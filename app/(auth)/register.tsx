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

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

export const AvatarPreview = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  align-self: center;
  margin-bottom: 15px;
  background-color: ${({ theme }) => theme.border};
`;

export const PhotoActionContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const SecondaryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  flex: 0.48;
`;

export const SecondaryButtonText = styled.Text`
  color: ${({ theme }) => theme.tint};
  font-size: 14px;
  font-weight: 600;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.card};
`;

const StyledButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.tint};
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

export const RedirectText = styled.Text`
  text-align: center;
  margin-top: 15px;
  color: ${({ theme }) => theme.subtext};
`;
