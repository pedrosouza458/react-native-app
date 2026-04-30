import { GitHubRepository, SavedRepository } from "@/types/github";
import { create } from "zustand";

interface RepoState {
  savedRepos: SavedRepository[];
  favorite: (repo: GitHubRepository) => void;
  unfavorite: (repoId: number) => void;
}

export const useRepoState = create<RepoState>((set) => ({
  savedRepos: [],
  favorite: (repo) => {
    set((state) => {
      const favoriteRepo: SavedRepository = {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url,
        },
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        html_url: repo.html_url,
      };

      return { savedRepos: [...state.savedRepos, favoriteRepo] };
    });
  },
  unfavorite: (repoId) => {
    set((state) => ({
      savedRepos: state.savedRepos.filter((repo) => repo.id !== repoId),
    }));
  },
}));
