import pool from '../utils/db'
import bcrypt from 'bcryptjs'

export interface IUser {
  id?: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserModel {
  static async createUser(user: IUser): Promise<IUser> {
    const { email, password, name } = user;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, "createdAt", "updatedAt";',
      [email, hashedPassword, name]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const result = await pool.query('SELECT id, email, password, name, "createdAt", "updatedAt" FROM users WHERE email = $1;', [email]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<IUser | null> {
    const result = await pool.query('SELECT id, email, name, "createdAt", "updatedAt" FROM users WHERE id = $1;', [id]);
    return result.rows[0] || null;
  }

  static async comparePassword(candidatePassword: string, hashedPasswordFromDb: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPasswordFromDb);
  }

  static async updateUserName(id: string, name: string): Promise<boolean> {
    const result = await pool.query(
      'UPDATE users SET name = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id;',
      [name, id]
    );
    return (result.rowCount || 0) > 0;
  }
} 