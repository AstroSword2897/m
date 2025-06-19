import pool from '../utils/db'

export interface IStudyMaterial {
  id?: string;
  title: string;
  description?: string;
  content: string;
  type: 'note' | 'pdf' | 'link' | 'image';
  subject: string;
  tags?: string[];
  userId: string; // Changed from user to userId to match PostgreSQL column name
  createdAt?: Date;
  updatedAt?: Date;
}

export class StudyMaterialModel {
  static async create(material: IStudyMaterial): Promise<IStudyMaterial> {
    const { title, description, content, type, subject, userId, tags } = material;
    const result = await pool.query(
      'INSERT INTO study_materials (title, description, content, type, subject, user_id, tags) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
      [title, description, content, type, subject, userId, tags ? JSON.stringify(tags) : null]
    );
    return result.rows[0];
  }

  static async find(query: { userId?: string, subject?: string, tags?: string[] } = {}): Promise<IStudyMaterial[]> {
    let queryString = 'SELECT * FROM study_materials WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (query.userId) {
      queryString += ` AND user_id = $${paramIndex++}`;
      params.push(query.userId);
    }
    if (query.subject) {
      queryString += ` AND subject = $${paramIndex++}`;
      params.push(query.subject);
    }
    // Note: Filtering by tags in PostgreSQL needs more complex logic if it's an array field
    // For now, let's assume simple string matching or exact array match if tags are stored as JSONB

    queryString += ' ORDER BY "createdAt" DESC';
    const result = await pool.query(queryString, params);
    return result.rows;
  }

  static async findById(id: string, userId: string): Promise<IStudyMaterial | null> {
    const result = await pool.query('SELECT * FROM study_materials WHERE id = $1 AND user_id = $2;', [id, userId]);
    return result.rows[0] || null;
  }

  static async update(id: string, updates: Partial<IStudyMaterial>, userId: string): Promise<IStudyMaterial | null> {
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        // Handle tags separately as JSONB
        if (key === 'tags') {
          setClauses.push(`tags = $${paramIndex++}`);
          params.push(updates[key] ? JSON.stringify(updates[key]) : null);
        } else if (key !== 'id' && key !== 'userId' && key !== 'createdAt') { // Prevent updating immutable fields
          setClauses.push(`"${key}" = $${paramIndex++}`);
          params.push((updates as any)[key]);
        }
      }
    }
    setClauses.push(`"updatedAt" = NOW()`);

    if (setClauses.length === 0) {
      return StudyMaterialModel.findById(id, userId); // No updates provided
    }

    const queryString = `UPDATE study_materials SET ${setClauses.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex++} RETURNING *;`;
    params.push(id, userId);

    const result = await pool.query(queryString, params);
    return result.rows[0] || null;
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM study_materials WHERE id = $1 AND user_id = $2;', [id, userId]);
    return result.rowCount !== null && result.rowCount > 0;
  }
} 