import pool from '../utils/db'

export interface Note {
  id?: string;
  title: string;
  content: string;
  subject?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NoteModel {
  static async createNote(note: Note): Promise<Note> {
    const { title, content, subject } = note;
    const result = await pool.query(
      'INSERT INTO notes (title, content, subject) VALUES ($1, $2, $3) RETURNING *;',
      [title, content, subject]
    );
    return result.rows[0];
  }

  static async getNotes(): Promise<Note[]> {
    const result = await pool.query('SELECT * FROM notes ORDER BY "createdAt" DESC;');
    return result.rows;
  }

  static async getNoteById(id: string): Promise<Note | null> {
    const result = await pool.query('SELECT * FROM notes WHERE id = $1;', [id]);
    return result.rows[0] || null;
  }

  static async updateNote(id: string, note: Partial<Note>): Promise<Note | null> {
    const { title, content, subject } = note;
    const result = await pool.query(
      'UPDATE notes SET title = COALESCE($1, title), content = COALESCE($2, content), subject = COALESCE($3, subject), "updatedAt" = NOW() WHERE id = $4 RETURNING *;',
      [title, content, subject, id]
    );
    return result.rows[0] || null;
  }

  static async deleteNote(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM notes WHERE id = $1;', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
} 