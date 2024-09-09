import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { verifyToken } from "../utils/generateToken.js";
import mongoose from "mongoose";

export const protectRoute = async (req, res, next) => {
    try {

        const accessToken = req.cookies["accessToken"];

        if(!accessToken) {
            return res.status(401).json({success: false, message: "Token not found"})
        }

        const decoded = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET || "");

        if(!decoded || !decoded?.userId) {
            return res.status(404).json({ success: false, message: "Invalid/notfound token" })
        }

        if(typeof decoded?.userId !== "string") {
            return res.status(400).json({ success: false, message: "Invalid userId " })
        }

        if(!mongoose.isValidObjectId(decoded?.userId)) {
            return res.status(400).json({ success: false, message: "Invalid userId " })
        }

        const user = await UserModel.findById(decoded?.userId).select("-password");

        if(!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        req.user = user;

        req.exp =  decoded?.exp;

        next();

    } catch (error) {
        console.log(`[PROTECT_ROUTE]: ${error}`)
        if(error instanceof jwt.TokenExpiredError) {
            console.log(`[SESSION_EXPIRED]`)
            return res.status(401).json({ success: false, message: "Session expired" })
        }
        if(error instanceof jwt.JsonWebTokenError) {
            console.log(`[SESSION_ERROR]`)
            return res.status(401).json({ success: false, message: "Session error" })
        }
        return res.status(500).json({ success: false, message: "Unknown error" })
    }
}

export const adminRoute = async (req, res, next) => {
    try {
        
        if(!req.user || req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized: Admin only" })
        }

        next();

    } catch (error) {
        console.log(`[ADMIN_ROUTE]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error" })
    }
}