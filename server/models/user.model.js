import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    cartItems: [
        {
            quantity: { type: Number, default: 1 },
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
        }
    ],
    role: { type: String, enum: ["customer", "admin"], default: "customer" },

}, { timestamps: true });


userSchema.pre("save", async function(next) {
    
    try {
        if(this.isModified("password")) {
            const salt = await bcrypt.genSalt(12);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
}


const UserModel = mongoose.models.users || mongoose.model("User", userSchema);

export default UserModel;