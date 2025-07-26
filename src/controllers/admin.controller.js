import Admin from "../models/admin.model.js";
import { BaseController } from "./base.controller.js";
import crypto from "../utils/Crypto.js";
import token from '../utils/Token.js';
import config from "../config/index.js";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/succes-respons.js";

export class AdminController extends BaseController {
    constructor() {
        super(Admin);
    }

    async createAdmin(req, res, next) {
        try {

            const { username, email, password } = req.body;
            const existsUsername = await Admin.findOne({ username });
            if (existsUsername) {
                throw new AppError('User name alrady exists', 409);
            }

            const existsEmail = await Admin.findOne({ email });
            if (existsEmail) {
                throw new AppError('Email adres alrady exists', 409);
            }

            const hashedPassword = await crypto.encrypt(password);
            const admin = await Admin.create({
                username,
                email,
                hashedPassword,
            });
            
            return successRes(res, admin, 201);

        } catch (error) {
            next(error)
        }
    }

    async signIn(req, res, next) {
        try {
            const { username, password } = req.body;

            const admin = await Admin.findOne({ username });
            const isMachPassword = await crypto.decrypt(password, admin?.hashedPassword ?? "");

            if (!isMachPassword) {
                throw new AppError('Username or password incorrect', 400);
            }

            const payload = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            };

            const accessToken = token.generateAccessToken(payload);
            const refreshToken = token.generateRefreshToken(payload);
            token.writeToCookie(res, 'refreshTokenAdmin', refreshToken, 30);

            return successRes(res, {
                token: accessToken,
                admin,
            });

        } catch (error) {
            next(error);
        }
    }

    async generateNewToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                throw new AppError('Refresh token expire', 401);
            }

            const verifiedToken = token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifiedToken) {
                throw new AppError('Aksest token expire', 401)
            }

            const admin = await Admin.findById(verifiedToken?.id);
            if (!admin) {
                throw new AppError('For bidden error', 403);
            }

            const payload = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            }

            const accessToken = token.generateAccessToken(payload);
            
            return successRes(res, { accessToken })

        } catch (error) {
            next(error);
        }
    }

    async signOut(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                throw new AppError('Refresh token expire', 401);
            }

            const verifiedToken = token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifiedToken) {
                throw new AppError('Aksest token expire', 401)
            }

            const admin = await Admin.findById(verifiedToken?.id);
            if (!admin) {
                throw new AppError('For bidden error', 403);
            }


            res.clearCookie('refreshTokenAdmin');
            return successRes(res, {})

        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();