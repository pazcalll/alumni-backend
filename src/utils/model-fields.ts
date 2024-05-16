import { PrismaClient, User } from "@prisma/client";

export const userFields = {
    select: {
        id: true,
        email: true,
        password: false,
        name: true,
        created_at: true,
        updated_at: true,
        is_approved: true
    }
}