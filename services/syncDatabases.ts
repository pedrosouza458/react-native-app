import { FavoriteRepository } from "@/types/github";
import * as SQLite from "expo-sqlite";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

let isSyncing = false;
export const syncDatabases = async () => {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const sqliteDb = await SQLite.openDatabaseAsync("gitlist.db");

    const toDelete = await sqliteDb.getAllAsync<FavoriteRepository>(
      "SELECT * FROM favorite_repositories WHERE deleted = 1",
    );

    if (toDelete.length > 0) {
      for (const item of toDelete) {
        try {
          if (item.synced === 1) {
            await deleteFavoriteRepository(item.id);
          }
          await sqliteDb.runAsync(
            "DELETE FROM favorite_repositories WHERE id = ?",
            [item.id],
          );
          console.log(`Repo with id ${item.id} removed from sql`);
        } catch (error) {
          console.log(`Failed to remove repo with id ${item.id} from sqlite`);
        }
      }
    }

    const pending = await sqliteDb.getAllAsync<FavoriteRepository>(
      "SELECT * FROM favorite_repositories WHERE synced = 0 AND deleted = 0",
    );

    if (pending.length > 0) {
      console.log(`Syncing ${pending} items with firebase...`);

      for (const item of pending) {
        const firebaseDb = db;
        await addDoc(collection(firebaseDb, "favorite_repositories"), {
          name: item.name,
          full_name: item.full_name,
          login: item.login,
          avatar_url: item.avatar_url,
          description: item.description,
          stargazers_count: item.stargazers_count,
          language: item.language || "Unknown",
          html_url: item.html_url,
          remote_id: item.id,
        });

        await sqliteDb.runAsync(
          "UPDATE favorite_repositories SET synced = 1 where id = ?",
          [item.id],
        );
      }
      console.log("Syncing completed with sucessfully!");
    }
  } catch (error) {
    console.log("Failed to sync databases: ", error);
  } finally {
    isSyncing = false;
  }
};

export const deleteFavoriteRepository = async (remoteId: number) => {
  const favoritesRepositories = collection(db, "favorite_repositories");

  const q = query(favoritesRepositories, where("remote_id", "==", remoteId));

  const getRepo = await getDocs(q);

  if (getRepo.empty) {
    console.log(`Repo with remote id ${remoteId} not found.`);
    return;
  }

  const firestoreId = getRepo.docs[0].id;
  await deleteDoc(doc(db, "favorite_repositories", firestoreId));
};
