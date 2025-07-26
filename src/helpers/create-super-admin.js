import Admin from "../models/admin.model.js";
import crypto from "../utils/Crypto.js";
import { disconnect } from "mongoose";
import { connectDB } from "../db/index.js";
import config from "../config/index.js"

(async function () {

    try {

        await connectDB();

        // console.log(config.ADMIN);

        const hashedPassword = await crypto.encrypt(config.ADMIN.SUPERADMIN_PASSWORD);

        await Admin.create({
            username: config.ADMIN.SUPERADMIN_USERNAME,
            email: config.ADMIN.SUPERADMIN_EMAIL,
            hashedPassword,
            role: 'SUPERADMIN'
        });

        console.log('Super admin success created');
        await disconnect();

    } catch (error) {
        console.log('Error on creating super amdin', error);
    }

}());
