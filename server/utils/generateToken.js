import jwt from "jsonwebtoken";

export const generateToken = (userId, tokenSecret, expiresIn) => {
    return jwt.sign({ userId }, tokenSecret, {expiresIn});
}

export const verifyToken = (token, tokenSecret) => {
    return jwt.verify(token, tokenSecret);
}