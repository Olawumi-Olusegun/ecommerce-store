import CouponModel from "../models/coupon.model.js"

export const getCoupon = async (req, res) => {
    try {
        const coupon = await CouponModel.findOne({ userId: req.user._id, isActive: true });

        if(!coupon) {
            return res.status(404).json({ coupon: null, success: false, message: "No coupon found" })
        }

        return res.status(200).json({ coupon, success: true, message: "Coupon found" })
        
    } catch (error) {
        console.log(`[GET_COUPON]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" }); 
    }
}

export const validateCoupon = async (req, res) => {
    const { code } = req.body;
    try {
        const coupon = await CouponModel.findOne({ code, userId: req.user._id, isActive: true });

        if(!coupon) {
            return res.status(404).json({ coupon: null, success: false, message: "No coupon found" })
        }

        if(coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(200).json({ success: true, message: "Coupon expired" })
        }

        return res.status(200).json({
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
            success: true,
            message: "Coupon is valid"
        });
        
    } catch (error) {
        console.log(`[GET_COUPON]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" }); 
    }
}