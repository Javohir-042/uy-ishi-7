import { config } from "dotenv";
config()

export default {

    PORT: Number(process.env.PORT),
    MONGO_URI: String(process.env.MONGO_URI),
    ADMIN: {
        SUPERADMIN_USERNAME: String(process.env.S_USERNAME),
        SUPERADMIN_PASSWORD: String(process.env.PASSWORD),
        SUPERADMIN_EMAIL: String(process.env.EMAIL),
    },
    TOKEN: {
        ACCESS_KEY: String(process.env.ACCESS_KEY),
        ACCESS_TIME: String(process.env.ACCESS_TIME),
        REFRESH_KEY: String(process.env.REFRESH_KEY),
        REFRESH_TIME: String(process.env.REFRESH_TIME),
    },
};
