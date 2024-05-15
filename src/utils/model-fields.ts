import { PrismaClient, User } from "@prisma/client";

export const userFields = {
    select: {
        id: true,
        email: true,
        password: false,
        name: true,
        createdAt: true,
        updatedAt: true,
        isApproved: true
    }
}