import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/helper";

const prisma = new PrismaClient();

export const seedAdmin = async () => {
    await prisma.admin.create({
        data: {
            email: "admin@mail.com",
            password: await hashPassword("121212"),
            name: "Admin"
        }
    });
}