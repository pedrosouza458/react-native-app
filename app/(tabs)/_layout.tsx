import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Image, View } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useFavoriteRepos } from "@/hooks/useFavoriteRepos";
import { auth } from "@/services/firebase";
import { syncDatabases } from "@/services/syncDatabases";
import { useFavoriteRepoStore } from "@/store/useFavoriteRepoStore";
import { StarIcon } from "phosphor-react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function HeaderAvatar() {
  const user = auth.currentUser;

  return (
    <View style={{ marginRight: 15, marginTop: 12, marginBottom: 12 }}>
      {user ? (
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
      ) : null}
    </View>
  );
}

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
