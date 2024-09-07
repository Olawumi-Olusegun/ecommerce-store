import mongoose from "mongoose";


const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Coupon code is required"],
        trim: true,
        unique: true,
    },
    discountPercentage: {
        type: Number,
        required: [true, "Discount percentage is required"],
        min: 0,
        max: 100
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });


const CouponModel = mongoose.models.coupon || mongoose.model("Coupon", couponSchema);

export default CouponModel;