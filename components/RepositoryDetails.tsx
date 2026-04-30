import { SavedRepository } from "@/types/github";
import { Code, GithubLogo, Star } from "phosphor-react-native";
import React from "react";
import { Linking } from "react-native";
import styled from "styled-components/native";

interface Props {
  data: SavedRepository;
}

interface StatItemProps {
  last?: boolean;
}

export default function RepositoryDetails({ data }: Props) {
  const handleOpenGithub = () => {
    Linking.openURL(data.html_url);
  };

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: data.owner.avatar_url }} />
        <OwnerName>{data.owner.login}</OwnerName>
        <RepoName>{data.name}</RepoName>
        <FullName>{data.full_name}</FullName>
      </Header>

      <StatsRow>
        <StatItem>
          <Star size={20} color="#EBD534" weight="fill" />
          <StatValue>{data.stargazers_count.toLocaleString()}</StatValue>
          <StatLabel>Stars</StatLabel>
        </StatItem>

        <StatItem>
          <Code size={20} color="#586069" />
          <StatValue>{data.language || "N/A"}</StatValue>
          <StatLabel>Language</StatLabel>
        </StatItem>
      </StatsRow>

      <Content>
        <SectionTitle>Description</SectionTitle>
        <Description>
          {data.description || "No description provided for this repository."}
        </Description>

        <GithubButton onPress={handleOpenGithub}>
          <GithubLogo size={24} color="#FFF" weight="fill" />
          <ButtonText>View on GitHub</ButtonText>
        </GithubButton>
      </Content>
    </Container>
  );
}

// Estilização com Styled Components
const Container = styled.ScrollView`
  flex: 1;
  background-color: #f6f8fa;
`;

const Header = styled.View`
  background-color: #fff;
  align-items: center;
  padding: 40px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #e1e4e8;
`;

const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border-width: 3px;
  border-color: #fff;
  margin-bottom: 16px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const OwnerName = styled.Text`
  font-size: 16px;
  color: #586069;
  margin-bottom: 4px;
`;

const RepoName = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #1f2328;
  text-align: center;
`;

const FullName = styled.Text`
  font-size: 14px;
  color: #0969da;
  margin-top: 4px;
`;

const StatsRow = styled.View`
  flex-direction: row;
  background-color: #fff;
  margin-top: 12px;
  padding: 20px 0;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: #e1e4e8;
`;

const StatItem = styled.View<StatItemProps>`
  flex: 1;
  align-items: center;
  border-right-width: ${({ last }) => (last ? "0px" : "1px")};
  border-right-color: #e1e4e8;
`;

const StatValue = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1f2328;
  margin-top: 4px;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: #586069;
  text-transform: uppercase;
`;

const Content = styled.View`
  padding: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1f2328;
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: 16px;
  color: #444d56;
  line-height: 24px;
  margin-bottom: 32px;
`;

const GithubButton = styled.Pressable`
  background-color: #24292e;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 12px;
  gap: 12px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
