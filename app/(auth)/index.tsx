import { signIn } from "@/services/auth";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      alert("you are logged in");
      router.replace("/(tabs)");
    } catch (error) {
      alert("Error creating account: " + error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Container>
        <Title>Login</Title>
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
        <StyledButton onPress={handleLogin}>
          <ButtonText>Login</ButtonText>
        </StyledButton>
        <RedirectText>
          Don't have a account?{" "}
          <Link href="/(auth)/register">Create a account</Link>
        </RedirectText>
      </Container>
    </TouchableWithoutFeedback>
  );
}

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
