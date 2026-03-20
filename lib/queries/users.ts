import pool from '@/lib/db';
import crypto from 'crypto';

export type DBUser = {
  id: number;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password_hash: string | null;
};

export async function findUserByEmail(email: string): Promise<DBUser | null> {
  const result = await pool.query<DBUser>(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return result.rows[0] ?? null;
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<DBUser> {
  const hash = await hashPassword(password);
  const result = await pool.query<DBUser>(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [name, email, hash]
  );
  return result.rows[0];
}

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}
