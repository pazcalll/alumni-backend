import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { dataResponseJson, dataResponsePagination, prismaPagination } from "../../utils/helper";
import { userFields } from "../../utils/model-fields";

const prisma = new PrismaClient();

export const registrationRequests = async (req: Request, res: Response) => {
    let requests = await prisma.user.findMany({
        ...prismaPagination(Number(req.query.page), Number(req.query.limit)),
        where: {
            is_approved: false,
        }
    });

    return dataResponsePagination(res, requests, Number(req.query.page), Number(req.query.limit));
}

export const approveRegistration = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id) return dataResponseJson(res, {}, "Invalid user id", 400);

    let user = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            is_approved: true
        },
        ...userFields
    });

    return dataResponseJson(res, user, "User approved successfully");
}