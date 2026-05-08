import { useFavoriteRepos } from "@/hooks/useFavoriteRepos";
import { useFavoriteRepoStore } from "@/store/useFavoriteRepoStore";
import { GitHubRepository, SavedRepository } from "@/types/github";
import { Link } from "expo-router";
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
  const { favorite, unfavorite } = useFavoriteRepos();

  const savedRepos = useFavoriteRepoStore((state) => state.savedRepos);

  const isFavorite = savedRepos.some(
    (repo: SavedRepository) => repo.id === data.id,
  );

  const handleToggleFavorite = () => {
    if (isFavorite) {
      unfavorite(data.id);
    } else {
      favorite(data as GitHubRepository);
    }
  };
  return (
    <RepoCard>
      <Link
        href={{
          pathname: "/repo/[id]",
          params: {
            id: data.id,
            name: data.name,
            description: data.description ?? "",
            full_name: data.full_name,
            login: data.owner.login,
            avatar_url: data.owner.avatar_url,
            stargazers_count: data.stargazers_count,
            language: data.language ?? "",
            html_url: data.html_url,
          },
        }}
        asChild
      >
        <Pressable>
          <RepoHeader>
            <RepoTitle numberOfLines={1}>{data.name}</RepoTitle>
            <RepoOwner>{data.owner.login}</RepoOwner>
          </RepoHeader>
          <RepoDescription numberOfLines={3} ellipsizeMode="tail">
            {data.description}
          </RepoDescription>
        </Pressable>
      </Link>
      <RepoFooter>
        <Pressable onPress={handleToggleFavorite}>
          <StarsContainer>
            <StarIcon
              size={16}
              weight={isFavorite ? "fill" : "regular"}
              color={isFavorite ? "#ebd534" : "#8c8c8c"}
            />
            <StargazeCount>{data.stargazers_count}</StargazeCount>
          </StarsContainer>
        </Pressable>
        {data.language ? (
          <RepoLanguage language={data.language}>{data.language}</RepoLanguage>
        ) : (
          <></>
        )}
      </RepoFooter>
    </RepoCard>
  );
}

const RepoCard = styled.View`
  background-color: ${({ theme }) => theme.card};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.border};
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
  color: ${({ theme }) => theme.tint};
  flex: 1;
  margin-right: 10px;
`;

const RepoOwner = styled.Text`
  flex-shrink: 0;
  color: ${({ theme }) => theme.subtext};
  font-size: 14px;
`;

const RepoDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  line-height: 20px;
`;

const RepoFooter = styled.View`
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StarsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 3px;
`;

const StargazeCount = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.subtext};
  margin-left: 4px;
`;

const RepoLanguage = styled.Text<RepoLanguageProps>`
  font-size: 12px;
  color: #fff; /* Texto da linguagem geralmente mantém contraste fixo */
  background-color: ${({ language }) =>
    languageColors[language || ""] || languageColors.default};
  padding: 4px 12px;
  border-radius: 14px;
  font-weight: bold;
  overflow: hidden;
`;
