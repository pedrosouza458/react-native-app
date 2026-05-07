import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Pressable } from "react-native";

import { Text } from "@/components/Themed";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useFavoriteRepos } from "@/hooks/useFavoriteRepos";
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

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { loadFavorites } = useFavoriteRepos();

  const savedCount = useFavoriteRepoStore((state) => state.savedRepos.length);

  useEffect(() => {
    loadFavorites();
    syncDatabases();
  }, [loadFavorites]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trending",
          headerTitleAlign: "left",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <>
              <Link href="/(auth)/register" asChild>
                <Text>Register</Text>
              </Link>
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={Colors[colorScheme ?? "light"].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Favorites",
          headerTitleAlign: "left",
          tabBarIcon: ({ color }) => <StarIcon color={color} />,
          tabBarBadge: savedCount > 0 ? savedCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].tint,
            color: "#fff",
          },
        }}
      />
    </Tabs>
  );
}
