import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const getUsers = async (query: { role?: string; isActive?: string; search?: string }) => {
  const where: any = {};
  if (query.role) where.role = query.role;
  if (query.isActive !== undefined) where.isActive = query.isActive === 'true';
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  return prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, role: true, isActive: true, isVerified: true, profilePicture: true, bio: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, isActive: true, isVerified: true, profilePicture: true, bio: true, createdAt: true, updatedAt: true },
  });
  if (!user) throw new NotFoundError('User');
  return user;
};

export const updateUser = async (id: string, data: { name?: string; role?: string; isActive?: boolean; isVerified?: boolean; bio?: string }) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError('User');

  return prisma.user.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.role && { role: data.role as any }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.isVerified !== undefined && { isVerified: data.isVerified }),
      ...(data.bio !== undefined && { bio: data.bio }),
    },
    select: { id: true, name: true, email: true, role: true, isActive: true, isVerified: true, bio: true },
  });
};

export const deactivateUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError('User');

  return prisma.user.update({ where: { id }, data: { isActive: false } });
};

export const resetUserPassword = async (id: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError('User');

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({ where: { id }, data: { password: hashed } });
};

export const createStudent = async (name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new BadRequestError('User already exists');

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  return prisma.user.create({
    data: { name, email, password: hashed, role: 'student' },
    select: { id: true, name: true, email: true, role: true },
  });
};
