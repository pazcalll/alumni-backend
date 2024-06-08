import { Response } from "express";
import fs from 'fs';
import { userUpdateable } from "../../utils/model-updateable-fields";
import { dataResponseJson, hashPassword, userSnakeCase, usersSnakeCase } from "../../utils/helper";
import { PrismaClient } from "@prisma/client";
import { userFields } from "../../utils/model-fields";

const prisma = new PrismaClient();

export const updateProfile = async (req: any, res: Response) => {
    const {
        name,
        password,
        graduation_year,
        address,
        mobile,
        lat,
        long
    } = req.body;

    const user = req.user;

    const userImage = req.files[0];
    const filename = userImage.fieldname + '-' + Date.now() + '.' + userImage.mimetype.split('/')[1];
    fs.writeFileSync(`storage/${filename}`, userImage.buffer);

    let updateData: userUpdateable = {
        name: name,
        userDetail: {
            update: {
                graduation_year: Number(graduation_year),
                address: address,
                mobile: mobile,
                lat: lat,
                long: long,
                image_url:filename
            }
        }
    }

    if (password) {
        const hashedPassword = await hashPassword(password);
        updateData.password = hashedPassword;
    }

    const update = await prisma.user.update({
        where: {
            id: user.id
        },
        data: updateData
    });

    return dataResponseJson(res, {}, "User updated successfully");
}

export const getProfile = async (req: any, res: Response) => {
    const user = req.user;
    const profile = await prisma.user.findFirst({
        where: {
            id: user.id
        },
        select: {
            ...userFields.select,
            userDetail: true
        }
    });

    if (profile && profile.userDetail) {
        profile.userDetail.image_url = req.protocol+'://'+req.get('host')+'/'+profile?.userDetail?.image_url;
    }

    let toSnakeCase = () => {
        if (!profile) return profile;
        return userSnakeCase(profile)
    };

    return dataResponseJson(res, toSnakeCase(), "User profile");
}