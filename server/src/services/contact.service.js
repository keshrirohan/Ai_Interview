import { prisma } from "../../lib/prisma.js";

export const createContactMessageService = async (data, userId = null) => {
  const { name, email, subject, message } = data;

  if (!name || !email || !message) {
    throw new Error("Name, email, and message are required.");
  }

  const contactMessage = await prisma.contactMessage.create({
    data: {
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : "General Inquiry",
      message: message.trim(),
    },
  });

  return contactMessage;
};
