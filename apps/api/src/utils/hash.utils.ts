import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashIp = (ip: string) => {
  return crypto.createHash('sha256').update(ip).digest('hex');
};
