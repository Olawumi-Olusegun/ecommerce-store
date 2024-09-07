import CouponModel from "../models/coupon.model.js";
import OrderModel from "../models/order.model.js";
import { stripe } from "../utils/stripe.js";


const createStripeCoupon = async (discountPercentage) => {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    })

    return coupon.id;
}

const createNewCoupon = async (userId) => {
    
    try {

        await CouponModel.findOneAndDelete({ userId })
        
        const newCoupon = new CouponModel({ 
            code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            discountPercentage: 10,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            userId,
        });
    
        const savedCoupon = await newCoupon.save();

        return savedCoupon;

    } catch (error) {
        console.log(`[NEW_COUPON]: ${error}`)
        throw error;
    }


}

export const createCheckoutSession = async (req, res) => {

    const { products, couponCode } = req.body;

    try {

        if(!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or empty products array" })
        }

        let totalAmount = 0;

        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100) // product amount in cents
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount
                },
                quantity: product.quantity || 1
            }
        });

        let coupon = null;


        if(couponCode) {
        
            coupon = await CouponModel.findOne({code: couponCode, userId: req.user._id, isActive: true});

            if(coupon) {
                totalAmount -= Math.round(totalAmount * coupon?.discountPercentage / 100);
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancelled`,
            discounts: coupon
                ? [ { coupon: await createStripeCoupon(coupon?.discountPercentage) } ]
                : [],
            metadata: {
                userId: req.user.id,
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((product) => ({
                        id: product._id,
                        quantity: product.quantity,
                        price: product.price,
                    }))
                )
            }
        });

        if(totalAmount >= 20000) {
            await createNewCoupon(req.user?._id)
        }

        const result = {
            id: session.id,
            totalAmount: totalAmount / 100
        }

        return res.status(200).json({ result, success: true, message: "Coupon" }); 
        
    } catch (error) {
        console.log(`[PAYMENT_ERROR]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" }); 
    }
}

export const checkoutSuccess = async (req, res) => {
    const { sessionId } = req.body;
    try {

        if(!sessionId) {
            return res.status(400).json({ success: false, message: "Invalid session ID"})
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(!session || !session.id) {
            return res.status(404).json({ success: false, message: "Session not found"})
        }

        if(session.payment_status === "paid") {

            if(session.metadata?.couponCode) {
                await CouponModel.findByIdAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId,
                }, 
                { isActive: false } )
            }
        }

        const products = JSON.parse(session.metadata.products);

        const newOrder = new OrderModel({
            user: session.metadata.userId,
            products: products?.map((product) => ({
                product: product.id,
                quantity: product.quantity,
                price: product.price,
            })),
            totalAmount: session.amount_total / 100, // convert from cents to dollar
            paymentIntent: session.payment_intent,
            stripeSessionId: sessionId,
        });

        const savedOrder = await newOrder.save();

        if(!savedOrder) {
            return res.status(400).json({ success: false, message: "Order saved successfully"});
        }

        return res.status(200).json({
            orderId: newOrder.id,
            success: true,
            message: "Payment successfully, order created and coupon deactivated if used"
        });

    } catch (error) {
        console.log(`[CHECKOUT_SUCCESS]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" });
    }
}