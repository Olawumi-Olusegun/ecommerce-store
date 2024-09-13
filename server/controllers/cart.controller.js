import ProductModel from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
    try {

        let cartItems = [];

        const productIds = req.user.cartItems.map((item) => item.product);
        const products = await ProductModel.find({ _id: { $in: productIds } });

        if(products.length > 0) {
            cartItems = products.map((product) => {
                const item = req.user.cartItems.find((cartItem) => cartItem.product.toString() === product._id.toString());
                return {
                    ...product.toJSON(),
                    quantity: item.quantity,
                }
            });
        }

        const message = cartItems?.length > 0 ? "Cart items" : "No item in your cart"

        return res.status(200).json({cartItems, success: true, message })    

    } catch (error) {
        console.log(`[CART_PRODUCTS]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" }); 
    }
}

export const addToCart = async (req, res) => {

    const { productId } = req.body;
    const user = req.user;

    let message = "";

    try {

        const existingItem = user.cartItems.find((item) => item?.product.toString() === productId);

        if(existingItem) {
            existingItem.quantity += 1;
            message = "Cart incremented"
        } else {
            user.cartItems.push({ product: productId });
             message = "Item added to cart"
        }

       await user.save();

        return res.status(200).json({ success: true, message })
    } catch (error) {
        console.log(`[ADD_TO_CART]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" });
    }
}

export const updateCartQuantity = async (req, res) => {

    const { productId } = req.params;
    const { quantity } = req.body;

    const user = req.user;

    try {

        const existingItem = user.cartItems.find((item) => item?.product?.toString() === productId);

        if(!existingItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        existingItem.quantity = quantity;

        if(existingItem.quantity <= 0) {

            user.cartItems = user.cartItems.filter((item) => item?.product?.toString() !== productId);

            await user.save();

            return res.status(200).json({
                carts: user.cartItems,
                success: true,
                message: "Item removed from cart"
            });
        }

        await user.save();

        return res.status(200).json({carts: user.cartItems, success: true, message: "Cart updated successfully"});

    } catch (error) {
        console.log(`[UPDATE_CART_PRODUCT_QUANTITY]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" });
    }
}

export const removeAllFromCart = async (req, res) => {

    const { productId } = req.params;
    const user = req.user;

    try {

        if(!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item) => item.product?.toString() !== productId)
        }

        await user.save();

        return res.status(200).json({ cartItems: user.cartItems, success: true, message: "Item removed from cart"});

    } catch (error) {
        console.log(`[REMOVE_ALL_FROM_CART]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" });
    }
}