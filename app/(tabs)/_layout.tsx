import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import UserMenu from "@/components/UserMenu";
import Colors from "@/constants/Colors";
import { useFavoriteRepos } from "@/hooks/useFavoriteRepos";
import { auth } from "@/services/firebase";
import { syncDatabases } from "@/services/syncDatabases";
import { useFavoriteRepoStore } from "@/store/useFavoriteRepoStore";
import { StarIcon } from "phosphor-react-native";
import styled from "styled-components/native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function HeaderAvatar() {
  const user = auth.currentUser;
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View style={{ marginRight: 15, marginTop: 12, marginBottom: 12 }}>
      {user ? (
        <>
          <Pressable onPress={toggleMenu}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
              }}
              source={{
                uri: user?.photoURL || "https://via.placeholder.com/100",
              }}
            />
          </Pressable>
          <Modal
            transparent={true}
            visible={menuVisible}
            animationType="fade"
            onRequestClose={toggleMenu}
          >
            <TouchableWithoutFeedback onPress={toggleMenu}>
              <ModalOverlay>
                <MenuContainer>
                  <UserMenu />
                </MenuContainer>
              </ModalOverlay>
            </TouchableWithoutFeedback>
          </Modal>
        </>
      ) : null}
    </View>
  );
}

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5); /* Escurece o fundo */
  justify-content: flex-start;
  align-items: flex-end;
  padding-top: 110px; /* Alinha logo abaixo da sua Navbar de 110px */
  padding-right: 15px;
`;

const MenuContainer = styled.View`
  width: 200px;
  /* A sombra ajuda o menu a "saltar" do fundo escuro */
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
`;

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { loadFavorites } = useFavoriteRepos();

  const savedCount = useFavoriteRepoStore((state) => state.savedRepos.length);

  useEffect(() => {
    loadFavorites();
    syncDatabases();
  }, [loadFavorites]);
  const badgeColor =
    colorScheme === "dark"
      ? "#2f95dc" // Um azul bonito para o modo dark
      : Colors[colorScheme ?? "light"].tint;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerTitle: "gitlist",
        headerTitleAlign: "left",
        headerRight: () => <HeaderAvatar />,
        headerRightContainerStyle: {
          paddingRight: 15,
          paddingBottom: 15,
          justifyContent: "flex-end",
        },
        headerTitleContainerStyle: {
          paddingBottom: 20,
          justifyContent: "flex-end",
        },
        headerStyle: {
          height: 110,
          backgroundColor: Colors[colorScheme ?? "light"].card,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trending",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => <StarIcon color={color} />,
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: badgeColor,
            color: "#fff",
          },
        }}
      />
    </Tabs>
  );
}
