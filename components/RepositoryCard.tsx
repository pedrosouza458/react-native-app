import { GitHubRepository } from "@/types/github";
import styled from "styled-components/native";

export default function RepositoryCard({ data }: { data: GitHubRepository }) {
  return (
    <RepoCard>
      <RepoHeader>
        <RepoTitle>{data.name}</RepoTitle>
        <RepoOwner>{data.owner.login}</RepoOwner>
      </RepoHeader>
      <StarsCount>{data.stargazers_count} stars</StarsCount>
    </RepoCard>
  );
}

const RepoCard = styled.View`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const RepoHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const RepoTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #007aff;
`;

const RepoOwner = styled.Text``;

const StarsCount = styled.Text``;
