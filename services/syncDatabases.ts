import { FavoriteRepository } from "@/types/github";
import * as SQLite from "expo-sqlite";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

let isSyncing = false;
export const syncDatabases = async () => {
  const user = auth.currentUser;

  if (isSyncing || !user) return;

  isSyncing = true;
  try {
    const sqliteDb = await SQLite.openDatabaseAsync("gitlist.db");

    const toDelete = await sqliteDb.getAllAsync<FavoriteRepository>(
      `SELECT fr.* FROM favorite_repositories fr  
       JOIN user_favorite_repositories ufr ON fr.id = ufr.repository_id
       WHERE ufr.is_deleted = 1 AND ufr.user_id = ?`,
      [user.uid],
    );

    if (toDelete.length > 0) {
      for (const item of toDelete) {
        try {
          await deleteDoc(
            doc(db, `users/${user.uid}/favorites`, item.id.toString()),
          );
          await sqliteDb.runAsync(
            "DELETE FROM user_favorite_repositories WHERE repository_id = ? AND user_id = ?",
            [item.id, user.uid],
          );

          const isStillReferenced = await sqliteDb.getFirstAsync(
            "SELECT 1 FROM user_favorite_repositories WHERE repository_id = ?",
            [item.id],
          );

          if (!isStillReferenced) {
            await sqliteDb.runAsync(
              "DELETE FROM favorite_repositories WHERE id = ?",
              [item.id],
            );
          }

          console.log(`Repo with id ${item.id} removed from sql`);
        } catch (error) {
          console.log(`Failed to remove repo with id ${item.id} from sqlite`);
        }
      }
    }

    const pending = await sqliteDb.getAllAsync<FavoriteRepository>(
      `SELECT fr.* FROM favorite_repositories fr 
       JOIN user_favorite_repositories ufr ON fr.id = ufr.repository_id
       WHERE ufr.is_deleted = 0 AND ufr.is_synced = 0 AND ufr.user_id = ?`,
      [user.uid],
    );

    if (pending.length > 0) {
      console.log(`Syncing ${pending} items with firebase...`);

      for (const item of pending) {
        const firebaseDb = db;
        const docRef = doc(
          db,
          `users/${user.uid}/favorites`,
          item.id.toString(),
        );
        await setDoc(docRef, {
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
          "UPDATE user_favorite_repositories SET is_synced = 1 WHERE repository_id = ? AND user_id = ?",
          [item.id, user.uid],
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
