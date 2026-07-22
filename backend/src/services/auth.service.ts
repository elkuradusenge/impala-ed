import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/database';
import generateToken from '../utils/generateToken';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../utils/errors';

export const registerUser = async (name: string, email: string, password: string, role?: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new BadRequestError('User already exists');

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: (role as any) || 'student' },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id, user.role),
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedError('Invalid email or password');
  if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new UnauthorizedError('Invalid email or password');

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
    token: generateToken(user.id, user.role),
  };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, profilePicture: true, bio: true, isActive: true, isVerified: true, createdAt: true },
  });
  if (!user) throw new NotFoundError('User');
  return user;
};

export const updateProfile = async (userId: string, data: { name?: string; bio?: string; profilePicture?: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, role: true, bio: true, profilePicture: true },
  });
  return user;
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new BadRequestError('Current password is incorrect');

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new NotFoundError('User');

  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: new Date(Date.now() + 3600000),
    },
  });

  return resetToken;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { gt: new Date() },
    },
  });

  if (!user) throw new BadRequestError('Invalid or expired token');

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetPasswordToken: null, resetPasswordExpire: null },
  });
};
