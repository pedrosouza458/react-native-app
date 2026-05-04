import { syncDatabases } from "@/services/syncDatabases";
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
        "SELECT * FROM favorite_repositories WHERE DELETED = 0",
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
      name: repo.name || "",
      full_name: repo.full_name || "",
      description: repo.description || "",
      owner: {
        login: repo.owner?.login || "unknown",
        avatar_url: repo.owner?.avatar_url || "",
      },
      language: repo.language || "Unknown",
      stargazers_count: repo.stargazers_count || 0,
      html_url: repo.html_url || "",
      deleted: 0,
      synced: 0,
    };

    const params = [
      favoriteRepo.id,
      favoriteRepo.name,
      favoriteRepo.full_name,
      favoriteRepo.description,
      favoriteRepo.owner.login,
      favoriteRepo.owner.avatar_url,
      favoriteRepo.stargazers_count,
      favoriteRepo.language,
      favoriteRepo.html_url,
      0,
      0,
    ];
    try {
      await db.runAsync(
        "INSERT OR REPLACE INTO favorite_repositories (id, name, full_name, description, login, avatar_url, stargazers_count, language, html_url, deleted, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        params,
      );

      set((state) => {
        return { savedRepos: [...state.savedRepos, favoriteRepo] };
      });

      syncDatabases().catch((err) =>
        console.error("Background sync failed", err),
      );
    } catch (error) {
      console.error("Error saving repository in database.", error);
    }
  },
  unfavorite: async (id, db) => {
    try {
      await db.runAsync(
        "UPDATE favorite_repositories SET deleted = 1 WHERE id = ?",
        [id],
      );

      set((state) => ({
        savedRepos: state.savedRepos.filter((repo) => repo.id !== id),
      }));

      syncDatabases();
    } catch (error) {
      console.error("Error removing repository in database.", error);
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
    deleted: row.deleted,
    synced: row.synced,
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
    deleted: repo.deleted,
    synced: repo.synced,
  };
}
