import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/helper";

const prisma = new PrismaClient();

export const seedUser = async () => {
    let length = 0;
    let users = [];
    while (length < 5) {
        users[length] = await prisma.user.create({
            data: {
                email: "user" + length + "@trash-mail.com",
                password: await hashPassword("121212"),
                name: "user"+length,
            }
        });
        length++;
    }

    for (const user of users) {
        await prisma.userDetail.create({
            data: {
                user_id: user.id,
                address: "Jl. Jalan",
                mobile: "08123456789",
                graduation_year: 2022,
                lat: "-7.9546559",
                long: "112.5303091",
            }
        });
    }
}