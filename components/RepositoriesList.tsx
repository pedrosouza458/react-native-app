import { getTrendingRepos } from "@/services/githubApi";
import { GitHubRepository } from "@/types/github";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import RepositoryCard from "./RepositoryCard";

export default function RepositoriesList() {
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTrendingRepos();
        setRepos(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Container>
      <Title>Repositories List</Title>
      {loading ? (
        <LoadingText>Loading repositories...</LoadingText>
      ) : (
        <FlatList
          data={repos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RepositoryCard data={item} />}
          ListEmptyComponent={
            <RepoNotFound>Failed to fetch repositories</RepoNotFound>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const LoadingText = styled.Text`
  color: #666;
`;

const RepoNotFound = styled.Text`
  color: red;
  margin-top: 20px;
`;
