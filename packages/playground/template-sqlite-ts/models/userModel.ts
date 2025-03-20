import db from "../config/db";

export interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
}

export const getAllUsers = (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows as User[]);
    });
  });
};

export const getUserById = (id: number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve((row as User) || null);
    });
  });
};

export const getUserByEmail = (email: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve((row as User) || null);
    });
  });
};

export const createUser = (user: User): Promise<User> => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [user.name, user.email],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          ...user,
          id: this.lastID,
        });
      }
    );
  });
};

export const updateUser = (
  id: number,
  user: Partial<User>
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const fields: string[] = [];
    const values: any[] = [];

    if (user.name !== undefined) {
      fields.push("name = ?");
      values.push(user.name);
    }

    if (user.email !== undefined) {
      fields.push("email = ?");
      values.push(user.email);
    }

    if (fields.length === 0) {
      resolve(false);
      return;
    }

    values.push(id);

    db.run(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values,
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      }
    );
  });
};

export const deleteUser = (id: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes > 0);
    });
  });
};
