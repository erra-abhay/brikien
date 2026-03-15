import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES || '15m') as any
  });
};

export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES || '7d') as any
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { userId: string, role: string };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { userId: string, role: string };
};
