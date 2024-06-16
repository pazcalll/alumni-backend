import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { dataResponseArray, dataResponseJson, dataResponsePagination, prismaPagination } from "../../utils/helper";
import { userFields } from "../../utils/model-fields";
import fs from 'fs';

const prisma = new PrismaClient();

export const registrationRequests = async (req: Request, res: Response) => {
    let findManyJson = {
        where: {
            approved_at: null,
        },
        select: {
            ...userFields.select,
            userDetail: true
        }
    };

    if (req.query.page && req.query.limit) {
        findManyJson = {
            ...findManyJson,
            ...prismaPagination(Number(req.query.page), Number(req.query.limit))
        };
    }

    let requests = await prisma.user.findMany(findManyJson);

    return req.query.page && req.query.limit
        ? dataResponsePagination(res, requests, Number(req.query.page), Number(req.query.limit))
        : dataResponseArray(res, requests);
}

export const approveRegistration = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id) return dataResponseJson(res, {}, "Invalid user id", 400);

    let user = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            approved_at: new Date().toISOString()
        },
        ...userFields
    });

    return dataResponseJson(res, user, "User approved successfully");
}

export const userList = async (req: Request, res: Response) => {
    let requests = await prisma.user.findMany({
        ...prismaPagination(Number(req.query.page), Number(req.query.limit)),
        where: {
            approved_at: {
                not: null
            },
        }
    });

    return dataResponsePagination(res, requests, Number(req.query.page), Number(req.query.limit));
}

export const rejectRegistration = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!id) return dataResponseJson(res, {}, "Invalid user id", 400);

    let data = await prisma.user.findFirst({
        where: {
            id: id
        },
        select: {
            userDetail: true
        }
    });

    if (!data) return dataResponseJson(res, {}, "User not found", 404);

    const filePath = `storage/${data?.userDetail?.image_url}`;
    fs.unlinkSync(filePath);

    await prisma.userDetail.delete({
        where: {
            user_id: id
        }
    });

    let user = await prisma.user.delete({
        where: {
            id: id
        }
    });

    return dataResponseJson(res, user, "User has been rejected and removed successfully");
}