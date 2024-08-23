import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserType } from "../shared/types";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    avatarURL: { type: String },
    createdAt: { type: Date, required: true },
    lastOnline: { type: Date, required: true },
    phoneNumber: { type: Number, required: false },
    address: { type: String, required: false },
    isEmailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
	resetPasswordExpiresAt: {
        type: Date,
        default: null,
    },
    verificationToken: { type: String },
    verificationTokenExpiresAt: {
        type: Date,
        default: null,
    },
    },  
    {
    timestamps: true,
    }
);

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model<UserType>("User", UserSchema);
export default User;