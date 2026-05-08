import { signIn } from "@/services/auth";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import styled, { useTheme } from "styled-components/native";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const theme = useTheme();
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
  background-color: ${({ theme }) => theme.background};
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  padding: 15px;
  margin-bottom: 15px;
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
  color: #fff; /* Mantemos branco para contraste no botão azul/principal */
  font-size: 16px;
  font-weight: 600;
`;

export const RedirectText = styled.Text`
  text-align: center;
  margin-top: 20px;
  color: ${({ theme }) => theme.subtext};
`;
