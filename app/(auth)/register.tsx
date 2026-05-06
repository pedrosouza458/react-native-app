import { signUp } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import styled from "styled-components/native";

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const register = async () => {
    try {
      await signUp(email, password);
      alert("Account created");
      router.replace("/");
    } catch (error) {
      alert("Error creating account: " + error);
    }
  };

  return (
    <Container>
      <Title>Register Account</Title>
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
      <StyledButton onPress={register}>
        <ButtonText>Register</ButtonText>
      </StyledButton>
    </Container>
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
