import prisma from '../config/database';

export const sendMessage = async (data: {
  senderId: string; receiverId: string; subject?: string; content: string; senderName: string;
}) => {
  const message = await prisma.message.create({
    data: {
      senderId: data.senderId,
      receiverId: data.receiverId,
      subject: data.subject || '',
      content: data.content,
    },
    include: {
      sender: { select: { id: true, name: true, email: true, profilePicture: true } },
      receiver: { select: { id: true, name: true, email: true, profilePicture: true } },
    },
  });

  await prisma.notification.create({
    data: {
      userId: data.receiverId,
      type: 'message',
      title: 'New Message',
      message: `You have a new message from ${data.senderName}`,
    },
  });

  return message;
};

export const getConversations = async (userId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, isDeletedBySender: false },
        { receiverId: userId, isDeletedByReceiver: false },
      ],
    },
    include: {
      sender: { select: { id: true, name: true, email: true, profilePicture: true } },
      receiver: { select: { id: true, name: true, email: true, profilePicture: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const convMap = new Map<string, any>();
  for (const msg of messages) {
    const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    if (!convMap.has(partnerId)) {
      convMap.set(partnerId, {
        partner: msg.senderId === userId ? msg.receiver : msg.sender,
        lastMessage: msg,
        unreadCount: 0,
      });
    }
    if (msg.receiverId === userId && !msg.isRead) {
      convMap.get(partnerId)!.unreadCount++;
    }
  }

  return Array.from(convMap.values());
};

export const getMessages = async (userId: string, partnerId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
    },
    include: {
      sender: { select: { id: true, name: true, email: true, profilePicture: true } },
      receiver: { select: { id: true, name: true, email: true, profilePicture: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  await prisma.message.updateMany({
    where: { senderId: partnerId, receiverId: userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  return messages;
};

export const deleteMessage = async (messageId: string, userId: string) => {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) throw new Error('Message not found');

  const updates: any = {};
  if (message.senderId === userId) updates.isDeletedBySender = true;
  if (message.receiverId === userId) updates.isDeletedByReceiver = true;

  if (updates.isDeletedBySender && updates.isDeletedByReceiver) {
    await prisma.message.delete({ where: { id: messageId } });
  } else {
    await prisma.message.update({ where: { id: messageId }, data: updates });
  }
};

export const getUnreadCount = async (userId: string) => {
  const count = await prisma.message.count({
    where: { receiverId: userId, isRead: false, isDeletedByReceiver: false },
  });
  return { count };
};
