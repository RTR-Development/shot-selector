import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("shots.db");

//Initialize shot table
export const initShot = async () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS shots (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, abv REAL, occ INTEGER NOT NULL, imageUri TEXT, imageInt INTEGER);",
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

//Initialize wheel table
export const initWheel = async () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS wheel (active INTEGER NOT NULL);",
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
export const defaultShots = async () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT COUNT(*) FROM shots;",
        [],
        (_, result) => {
          if (result.rows._array[0]["COUNT(*)"] == 0) {
            tx.executeSql(
              "INSERT INTO shots (name, abv, occ, imageInt) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?);",
              ["Bier", 5, 1, 0, "Bacardi", 38, 1, 1, "Vodka", 35, 1, 2],
              (_, result) => {
                console.log("here3");
                resolve();
              },
              (_, err) => {
                reject(err);
              }
            );
          }
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

//Insert wheel status into database
export const insertWheel = (active) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO wheel (active) VALUES (?);",
        [active],
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

//Get wheel status from database
export const fetchWheel = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM wheel",
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

//Update wheel status of database
export const updateWheel = (active) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE wheel SET active = ?",
        [active],
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
