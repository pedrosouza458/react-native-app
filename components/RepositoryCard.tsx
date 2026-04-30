import { useRepoState } from "@/store/useRepoStore";
import { GitHubRepository, SavedRepository } from "@/types/github";
import { StarIcon } from "phosphor-react-native";
import { Pressable } from "react-native";
import styled from "styled-components/native";

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#d9c951",
  Java: "#b07219",
  Python: "#3572A5",
  Go: "#00ADD8",
  Vue: "#41B883",
  Makefile: "#427819",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#5f428a",
  Rust: "#dea584",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  C: "#6e6e6e",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Dart: "#00B4AB",
  Elixir: "#6e4a7e",
  default: "#007aff",
};

interface RepoLanguageProps {
  language?: string;
}

interface Props {
  data: GitHubRepository | SavedRepository;
}

export default function RepositoryCard({ data }: Props) {
  const { savedRepos, favorite, unfavorite } = useRepoState();

  const isFavorite = savedRepos.some(
    (repo: SavedRepository) => repo.id === data.id,
  );

  const handleToggleFavorite = () => {
    if (isFavorite) {
      unfavorite(data.id);
      console.log("desfavoritou");
    } else {
      favorite(data as GitHubRepository);
      console.log("favoritou");
    }
  };
  return (
    <Pressable onPress={handleToggleFavorite}>
      <RepoCard>
        <RepoHeader>
          <RepoTitle numberOfLines={1}>{data.name}</RepoTitle>
          <RepoOwner>{data.owner.login}</RepoOwner>
        </RepoHeader>
        <RepoDescription numberOfLines={3} ellipsizeMode="tail">
          {data.description}
        </RepoDescription>
        <RepoFooter>
          <StarsContainer>
            <StarIcon
              size={16}
              weight={isFavorite ? "fill" : "regular"}
              color={isFavorite ? "#ebd534" : "#8c8c8c"}
            />
            <StargazeCount>{data.stargazers_count}</StargazeCount>
          </StarsContainer>
          {data.language ? (
            <RepoLanguage language={data.language}>
              {data.language}
            </RepoLanguage>
          ) : (
            <></>
          )}
        </RepoFooter>
      </RepoCard>
    </Pressable>
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
  flex: 1;
  margin-right: 10px;
`;

const RepoOwner = styled.Text`
  flex-shrink: 0;
  color: #586069;
  font-size: 14px;
`;

const StarsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  gap: 3px;
`;

const StargazeCount = styled.Text`
  font-size: 14px;
  color: #586069;
  margin-left: 4px;
  include-font-padding: false;
  line-height: 18px;
`;

const RepoDescription = styled.Text``;

const RepoFooter = styled.View`
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const RepoLanguage = styled.Text<RepoLanguageProps>`
  font-size: 12px;
  color: #fff;
  background-color: ${({ language }) =>
    languageColors[language || ""] || languageColors.default};
  padding: 8px;
  border-radius: 14px;
  font-weight: bold;
`;
