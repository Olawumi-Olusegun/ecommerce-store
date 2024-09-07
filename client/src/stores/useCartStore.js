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
        set((prevState) => {
            const findIndex = prevState.cart.findIndex((item) => item?._id === cartItem?._id);
            
            const newCart = [...prevState.cart];
            
            if (findIndex >= 0) {
              newCart[findIndex] = {
                ...newCart[findIndex], 
                quantity: newCart[findIndex].quantity + 1,
              };
            } else {
              newCart.push({ ...cartItem, quantity: 1 });
            }
            return { ...prevState, cart: newCart };
          });
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
        set((prevState) => {

            const findIndex = prevState.cart.findIndex((item) => item?._id === product?._id)
            const newCart = [...prevState.cart];

            if(findIndex && newCart[findIndex].quantity > 0) {
                newCart[findIndex].quantity = quantity;
                newCart[findIndex] = {
                    ...newCart[findIndex],
                    quantity,
                }
            }

            return { ...prevState, cart: newCart }
        });

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