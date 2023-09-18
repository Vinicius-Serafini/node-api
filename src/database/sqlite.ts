import sqlite3 from "sqlite3";
import IDatabase from "@shared/interfaces/index.js";
import fs from "fs";
import path from "node:path";

export class SQLite implements IDatabase {
  static initDatabase(dirName: string) {

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    const location = path.join(dirName, "db.sqlite");

    return new Promise<SQLite>((resolve, reject) => {
      let db = new sqlite3.Database(location, (err) => {
        if (err) {
          return reject(err);
        }
      });

      db.run(
        'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, done BOOLEAN)',
        (err) => {
          if (err) {
            return reject(err);
          }
        }
      );

      resolve(new SQLite(db));
    });
  }

  private db: sqlite3.Database;

  constructor(database: sqlite3.Database) {
    this.db = database;
  }

  closeConnection() {
    return new Promise<void>((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    })
  }

  findById<Type>(table: string, id: number): Promise<Type | null> {
    return new Promise((resolve, reject) => {
      this.db.get<Type>(`SELECT * FROM ${table} WHERE id = ${id}`, (err, row) => {
        if (err) {
          return reject(err);
        }

        if (!row) {
          return resolve(null);
        }

        resolve(row as Type);
      });
    });
  }

  get<Type>(table: string): Promise<Array<Type>> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows as Array<Type>);
      });
    });
  }

  create<Type, NewType>(table: string, data: NewType): Promise<Type> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(data).join(", ");
      const values = Object.values(data).map(value => {
        return typeof value === "string" ? `'${value}'` : value
      }).join(", ");

      this.db.get(`INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *`, (err, row) => {
        if (err) {
          return reject(err);
        }

        resolve(row as Type);
      });
    });
  }

  update<Type>(table: string, id: number, data: Partial<Type>): Promise<Type> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(data)
        .filter(key => key !== 'id')
        .map(key => `${key}=?`)
        .join(", ");

      this.db.get(
        `UPDATE ${table} SET ${columns} WHERE id = ${id} RETURNING *`,
        [...Object.values(data)],
        (err, row) => {
          if (err) {
            return reject(err);
          }
          resolve(row as Type);
        }
      );
    });
  }

  delete<Type>(table: string, id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM ${table} WHERE id = ${id}`, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }
}