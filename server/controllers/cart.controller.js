import ProductModel from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({_id: { $in: req.user.cartItems } });
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
            return {
                ...product.toJSON(),
                quantity: item.quantity,
            }
        });

        return res.status(200).json({cartItems, success: true, message: "Cart items"})    

    } catch (error) {
        console.log(`[CART_PRODUCTS]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" }); 
    }
}

export const addToCart = async (req, res) => {
    const { productId } = req.body;
    const user = req.user;

    try {
        const existingItem = user.cartItems.find((item) => item?._id.toString() === productId);

        if(existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }

        await user.save();

        return res.status(200).json({ success: true, message: "Product added to cart"})
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
        const existingItem = user.cartItems.find((item) => item.id === productId);

        if(!existingItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        if(quantity === 0) {
            user.cartItems.filter((item) => item?._id !== productId);
            await user.save();
            return res.status(200).json({carts: user.cartItems, success: true, message: "Items in cart"});
        }

        existingItem.quantity = quantity;
        await user.save();
        return res.status(200).json({carts: user.cartItems, success: true, message: "Items in cart"});


    } catch (error) {
        console.log(`[UPDATE_CART_PRODUCT_QUANTITY]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" });
    }
}

export const removeAllFromCart = async (req, res) => {
    const { productId } = req.body;
    const user = req.user;

    try {

        if(!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId)
        }

        await user.save();
        return res.status(200).json({ success: true, message: "Products removed from cart"});

    } catch (error) {
        console.log(`[REMOVE_ALL_FROM_CART]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" });
    }
}