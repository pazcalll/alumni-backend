import { PrismaClient } from "@prisma/client";
import { dataResponseJson, prismaPagination } from "../utils/helper";
import { Response } from "express";
import { userFields } from "../utils/model-fields";

const prisma = new PrismaClient();

export const userList = async (req: any, res: Response) => {
    let dbQuery = {
        select: {
            ...userFields.select,
            userDetail: true
        },
        where: {
            approved_at: {
                not: null
            },
        }
    };

    if (req.query.page && req.query.limit) {
        const pagination = prismaPagination(Number(req.query.page), Number(req.query.limit));
        dbQuery = { ...dbQuery, ...pagination };
    }

    const users = await prisma.user.findMany(dbQuery);

    return dataResponseJson(res, users, "Data found", 200);
}