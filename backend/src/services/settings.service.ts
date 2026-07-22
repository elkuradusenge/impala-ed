import prisma from '../config/database';

export const getSettings = async () => {
  const settings = await prisma.platformSetting.findMany();
  const result: Record<string, any> = {};
  settings.forEach((s) => {
    result[s.key] = s.value;
  });
  return result;
};

export const updateSetting = async (key: string, value: string, description: string, userId: string) => {
  return prisma.platformSetting.upsert({
    where: { key },
    update: { value, description, updatedById: userId },
    create: { key, value, description, updatedById: userId },
  });
};

export const deleteSetting = async (key: string) => {
  await prisma.platformSetting.delete({ where: { key } });
};
