import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedMajor = async () => {
    const majors = [
        {
            name: "Kedokteran",
            degree: "S1",
        },
        {
            name: "Kedokteran Hewan",
            degree: "S1",
        },
        {
            name: "Kedokteran Gigi",
            degree: "S1",
        },
        {
            name: "Kebidanan",
            degree: "S1",
        },
        {
            name: "Keperatawan",
            degree: "S1",
        },
    ];

    for (const major of majors) {
        await prisma.major.create({
            data: major,
        });
    }
}