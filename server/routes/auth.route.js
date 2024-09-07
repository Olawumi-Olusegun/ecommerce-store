import express from "express";
import { newRefreshToken, signin, signout, signup, userProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/signout", signout)
router.post("/refresh-token", newRefreshToken);
router.get("/profile", protectRoute, userProfile);

export default router;