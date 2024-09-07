import { signin, signout, signup, userProfile } from "./auth";
import { addToCart, applyCoupon, fetchAnalyticsData, getCartItems, getMyCoupons, removeAllFromCart, updateCartQuantity } from "./cart";
import { 
    createProduct, 
    deleteProduct, 
    fetchAllProducts, 
    toggleFeaturedProduct, 
    fetchProductsByCategory,
    fetchRecommendedProducts,
    fetchFeaturedProducts,
} from "./product";

const api = {

    // auth
    signin,
    signup,
    userProfile,
    signout,

    // products
    createProduct,
    fetchAllProducts,
    toggleFeaturedProduct,
    deleteProduct,
    fetchProductsByCategory ,
    fetchRecommendedProducts,
    fetchFeaturedProducts,

    // cart
    addToCart,
    getCartItems,
    removeAllFromCart,
    updateCartQuantity,

    // coupons
    getMyCoupons,
    applyCoupon,

    // Analytics
    fetchAnalyticsData

}

export default api;