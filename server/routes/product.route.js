import express from "express";
import { 
    createNewProduct, 
    deleteProduct, 
    featuredProducts, 
    getAllProducts, 
    getProductsByCategory, 
    recommendedProducts, 
    toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.post("/", protectRoute, adminRoute, createNewProduct);
router.get("/featured-products", featuredProducts);
router.patch("/:productId", protectRoute, adminRoute, toggleFeaturedProduct);
router.get("/recommended-products", recommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.delete("/:productId", protectRoute, adminRoute, deleteProduct);

export default router;