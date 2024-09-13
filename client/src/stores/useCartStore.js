import { create } from 'zustand'

const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subTotal: 0,
    isCouponApplied: false,
    getCartItems: (cartItems) => {
        set({ cart: cartItems });
        get().calculateTotals();
    },

    addToCart: (cartItem) => {

        const cart = [...get().cart];
        const findCartIndex = cart.findIndex((item) => item?._id === cartItem?._id);

        if(findCartIndex >= 0) {
            cart[findCartIndex].quantity++;
        } else {
            cart.push({ ...cartItem, quantity: 1});
        }

        set({ cart });

        get().calculateTotals();

    },

    removeFromCart: (product) => {
        set((prevState) => ({ cart: prevState.cart.filter((item) => item?._id !== product?._id) }));
        get().calculateTotals();
    },

    clearCart: () => set({ cart: [], total: 0, subTotal: 0, coupon: null }),

    updateCartQuantity: (product, quantity) => {

        if(quantity === 0) {
            get().removeFromCart(product)
            return;
        }

        const cart = [...get().cart];

        const findIndex = cart.findIndex((item) => item?._id === product?._id);

        if(findIndex && cart[findIndex].quantity > 0) {
            cart[findIndex].quantity = quantity;
        }

        set({ cart });

        get().calculateTotals();

    },
    calculateTotals: () => {
        const { cart, coupon, } = get();
        const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subTotal;

        if(coupon) {
            const discount = subTotal * (coupon.discountPercentage / 100);
            total = subTotal - discount;
        }

        set({ subTotal, total });

    },
    getMyCoupons: (coupon) => set({ coupon }),
    applyCoupon: (coupon) => {
        set({ coupon, isCouponApplied: true });
        get().calculateTotals();
    },
    removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals();
    },
}))

export default useCartStore