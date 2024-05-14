import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { dataResponsePagination, prismaPagination } from "../../utils/helper";

export const registrationRequests = async (req: Request, res: Response) => {
    let requests = await (new PrismaClient()).user.findMany({
        ...prismaPagination(req.query.page, req.query.limit),
        where: {
            isApproved: false,
        }
    });

    return dataResponsePagination(res, requests, req.query.page, req.query.limit);
}