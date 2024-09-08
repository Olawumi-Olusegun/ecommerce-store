import Redis from "ioredis"
import dotenv  from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTACH_REDIS_URL || "", {
    connectTimeout: 10000
});

export const storeRefreshToken = async (userId, refreshToken) => {
    try {
        await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60) // 7days
    } catch (error) {
        console.log(`[REDIS]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error" })
    }
}
