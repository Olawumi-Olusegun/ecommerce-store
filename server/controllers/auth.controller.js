import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js"
import { generateToken, verifyToken } from "../utils/generateToken.js";
import { redis, storeRefreshToken } from "../utils/redis.js";

const setCookies = (res, accessToken, refreshToken) => {
    
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevent xss attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevent csrf attacks
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevent xss attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevent csrf attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
    });
}


export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const userExist = await UserModel.findOne({ email });

        if(userExist) {
            return res.status(400).json({ success: false, message: "User already exist" })
        }

        const newUser = new UserModel({email, password, name});

        const savedUser = await newUser.save();

        if(!savedUser) {
            return res.status(400).json({ success: false, message: "User account not created" })
        }


        // generate token
        const accessToken = generateToken(savedUser.id, process.env.ACCESS_TOKEN_SECRET, "15m");
        const refreshToken = generateToken(savedUser.id, process.env.REFRESH_TOKEN_SECRET,  "7d");

        await storeRefreshToken(savedUser.id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        return res.status(201).json({ 
            user: {
            _id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
        }, 
        success: true, 
        message: "User account created" 
    });

    } catch (error) {
        console.log(`[SIGNUP_ERROR]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}

export const signin = async (req, res) => {

    const { email, password} = req.body;
    try {

        const userExist = await UserModel.findOne({ email });

        if(!userExist) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        const isValidPassword = await userExist.comparePassword(password);

        if(!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        
        // generate token
        const accessToken = generateToken(userExist.id, process.env.ACCESS_TOKEN_SECRET, "15m");
        const refreshToken = generateToken(userExist.id, process.env.REFRESH_TOKEN_SECRET,  "7d");

        await storeRefreshToken(userExist.id, refreshToken);

        setCookies(res, accessToken, refreshToken);


        return res.status(200).json({ 
            user: {
            _id: userExist.id,
            name: userExist.name,
            email: userExist.email,
            role: userExist.role,
        }, 
        success: true, 
        message: "Logged in successfully" 
    });

    } catch (error) {
        console.log(`[SIGNIN_ERROR]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}

export const newRefreshToken = async (req, res) => {

    try {

        const refreshToken = req.cookies["refreshToken"];

        if(!refreshToken) {
            return res.status(400).json({ success: false, message: "Invalid token" })
        }

        const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if(!decoded || !decoded?.userId) {
            return res.status(404).json({ success: false, message: "Invalid/notfound token" })
        }

        const storedRefreshToken = await redis.get(`refresh_token:${decoded.userId}`);

        if(!storedRefreshToken) {
            return res.status(404).json({ success: false, message: "Token not found" })
        }

        if(storedRefreshToken !== refreshToken) {
            return res.status(400).json({ success: false, message: "Invalid/mis-matched token" })
        }

        const user = await UserModel.findById(decoded?.userId).select("-password");

        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }


        // generate token
        const newAccessToken = generateToken(user.id, process.env.ACCESS_TOKEN_SECRET, "15m");
        const newRefreshToken = generateToken(user.id, process.env.REFRESH_TOKEN_SECRET,  "7d");

        await storeRefreshToken(user.id, newRefreshToken);

        setCookies(res, newAccessToken, newRefreshToken);

        return res.status(200).json({
            user: {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }, 
        success: true, 
        message: "Token refreshed successfully" 
    });

    } catch (error) {
        console.log(`[SIGNIN_ERROR]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}

export const signout = async (req, res) => {
    try {

        const refreshToken = req.cookies["refreshToken"];
        if(refreshToken) {
            const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            if(decodedToken && decodedToken.userId) {
                await redis.del(`refresh_token:${decodedToken.userId}`)
            }
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.send();

    } catch (error) {
        console.log(`[SIGNOUT_ERROR]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}

export const userProfile = async (req, res) => {

    const exp = req.exp ?? undefined;

    const { _id, name, email, role, image } = req.user;

    try {
        const user = { _id, name, email, role, image, exp  }
        return res.status(200).json({user, success: true, message: "User profile"})
    } catch (error) {
        console.log(`[USER_PROFILE]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}