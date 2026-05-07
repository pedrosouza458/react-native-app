import { SavedRepository } from "@/types/github";
import { create } from "zustand";

interface FavoriteRepoState {
  savedRepos: SavedRepository[];
  setSavedRepos: (repos: SavedRepository[]) => void;
}

export const useFavoriteRepoStore = create<FavoriteRepoState>((set) => ({
  savedRepos: [],
  setSavedRepos: (repos) => set({ savedRepos: repos }),
}));
