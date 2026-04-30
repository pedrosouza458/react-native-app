import RepositoryDetails from "@/components/RepositoryDetails";
import { View } from "@/components/Themed";
import { SavedRepository } from "@/types/github";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabDetails() {
  const params = useLocalSearchParams();

  const repoData: SavedRepository = {
    id: Number(params.id),
    name: params.name as string,
    full_name: params.full_name as string,
    description: (params.description as string) ?? "",
    stargazers_count: Number(params.stargazers_count),
    language: (params.language as string) ?? "",
    html_url: params.html_url as string,
    owner: {
      login: params.login as string,
      avatar_url: params.avatar_url as string,
    },
  };

  return (
    <View style={styles.container}>
      <RepositoryDetails data={repoData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
