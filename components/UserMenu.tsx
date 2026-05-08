import { GearIcon, SignOutIcon, UserIcon } from "phosphor-react-native";
import styled, { useTheme } from "styled-components/native";

export default function UserMenu() {
  const theme = useTheme();
  return (
    <Container>
      <MenuItem onPress={() => {}}>
        <UserIcon size={20} color={theme.subtext} />
        <MenuItemText>Profile</MenuItemText>
      </MenuItem>
      <MenuItem onPress={() => {}}>
        <GearIcon size={20} color={theme.subtext} />
        <MenuItemText>Setting</MenuItemText>
      </MenuItem>
      <Separator />
      <MenuItem onPress={() => {}}>
        <SignOutIcon size={20} color={theme.subtext} />
        <MenuItemText>Logout</MenuItemText>
      </MenuItem>
    </Container>
  );
}

const Container = styled.View`
  background-color: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const MenuItem = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  gap: 12px;
`;

const MenuItemText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const LogoutText = styled(MenuItemText)`
  color: #ff4444; /* Vermelho padrão para logout */
  font-weight: bold;
`;

const Separator = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 8px 12px;
`;
