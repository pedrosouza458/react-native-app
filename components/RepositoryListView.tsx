import { GitHubRepository, SavedRepository } from "@/types/github";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import RepositoryCard from "./RepositoryCard";

interface Props {
  data: GitHubRepository[] | SavedRepository[];
  title: string;
  loading?: boolean;
  emptyMessage: string;
}

export function RepositoryListView({
  data,
  title,
  loading,
  emptyMessage,
}: Props) {
  return (
    <Container>
      <Title>{title}</Title>
      {loading ? (
        <LoadingText>Loading repositories...</LoadingText>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RepositoryCard data={item} />}
          ListEmptyComponent={<RepoNotFound>{emptyMessage}</RepoNotFound>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 26px;
`;

const LoadingText = styled.Text`
  color: #666;
`;

const RepoNotFound = styled.Text`
  margin-top: 20px;
`;
