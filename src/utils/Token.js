import config from "../config/index.js";
import jwt from 'jsonwebtoken';

class Token {
    generateAccessToken(payload) {                                   // Asestokinning muddati tugagandan song yangilab beradi
        return jwt.sign(payload, config.TOKEN.ACCESS_KEY, {
            expiresIn: config.TOKEN.ACCESS_TIME
        });
    }

    generateRefreshToken(payload) {                                  // Refreshtoken muddati tugaganda son otib yuborish 
        return jwt.sign(payload, config.TOKEN.REFRESH_KEY, {
            expiresIn: config.TOKEN.REFRESH_TIME
        });
    }

    writeToCookie(res, key, value, expireDay) {                     // Refreshtoken ni cookie ( tezkor xor)
        res.cookie(key, value, {
            httpOnly: true,
            secure: true,
            maxAge: Number(expireDay) * 24 * 60 * 60 * 1000
        });
    }

    verifyToken(token, secretKey) {                                 // token tekshirib true yoki false qaytaradi 
        return jwt.verify(token, secretKey);
    }
}

export default new Token();