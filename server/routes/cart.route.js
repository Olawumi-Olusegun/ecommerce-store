import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    addToCart,
    getCartProducts,
    removeAllFromCart,
    updateCartQuantity,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", protectRoute, addToCart);
router.get("/", protectRoute, getCartProducts);
router.delete("/:productId", protectRoute, removeAllFromCart);
router.put("/:productId", protectRoute, updateCartQuantity);

export default router;