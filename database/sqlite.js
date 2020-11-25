import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("shots.db");

//Initialize database
export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS shots (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, abv REAL, occ INTEGER NOT NULL, imageUri TEXT );",
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

//Insert shot info into database
export const insertShot = (name, abv, occ, imageUri) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO shots (name, abv, occ, imageUri) VALUES (?, ?, ?, ?);",
        [name, abv, occ, imageUri],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

//Delete shot info out of database
export const deleteShot = (id) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM shots WHERE id = ?",
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

//Get shot info from database
export const fetchShots = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM shots",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
