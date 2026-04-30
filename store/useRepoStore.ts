import {
  FavoriteRepository,
  GitHubRepository,
  SavedRepository,
} from "@/types/github";
import { SQLiteDatabase } from "expo-sqlite";
import { create } from "zustand";

interface RepoState {
  savedRepos: SavedRepository[];
  loadFavorites: (db: SQLiteDatabase) => void;
  favorite: (repo: GitHubRepository, db: SQLiteDatabase) => void;
  unfavorite: (repoId: number, db: SQLiteDatabase) => void;
}

export const useRepoState = create<RepoState>((set) => ({
  savedRepos: [],
  loadFavorites: async (db) => {
    try {
      const rows = await db.getAllAsync<FavoriteRepository>(
        "SELECT * FROM favorite_repositories",
      );

      const savedRepos = rows.map(toDomain);
      set({ savedRepos });
    } catch (error) {
      console.error("Failed to load favorite repos: ", error);
    }
  },
  favorite: async (repo, db) => {
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

    try {
      await db.runAsync(
        "INSERT INTO favorite_repositories (id, name, full_name, description, login, avatar_url, stargazers_count, language, html_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          favoriteRepo.id,
          favoriteRepo.name,
          favoriteRepo.full_name,
          favoriteRepo.description ?? "",
          favoriteRepo.owner.login,
          favoriteRepo.owner.avatar_url,
          favoriteRepo.stargazers_count,
          favoriteRepo.language ?? "",
          favoriteRepo.html_url,
        ],
      );

      set((state) => {
        return { savedRepos: [...state.savedRepos, favoriteRepo] };
      });
    } catch (error) {
      console.error("Error saving repository in database.", error);
    }
  },
  unfavorite: async (repoId, db) => {
    try {
      await db.runAsync("DELETE FROM favorite_repositories WHERE ID = ?", [
        repoId,
      ]);

      set((state) => ({
        savedRepos: state.savedRepos.filter((repo) => repo.id !== repoId),
      }));
    } catch (error) {
      console.error("Error deleting favorite repo from database", error);
    }
  },
}));

function toDomain(row: FavoriteRepository): SavedRepository {
  return {
    id: row.id,
    name: row.name,
    full_name: row.full_name,
    description: row.description,
    stargazers_count: row.stargazers_count,
    language: row.language,
    html_url: row.html_url,
    owner: {
      login: row.login,
      avatar_url: row.avatar_url,
    },
  };
}

function toDatabase(repo: SavedRepository): FavoriteRepository {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    login: repo.owner.login,
    avatar_url: repo.owner.avatar_url,
    description: repo.description,
    stargazers_count: repo.stargazers_count,
    language: repo.language || "Unknown",
    html_url: repo.html_url,
  };
}
