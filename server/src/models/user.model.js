import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Minimum password length is 6 characters'],
        select: false, // Don't return password in queries
    },

    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
    },

    refreshToken: {
        type: String,
        select: false, // Don't return refresh token in queries
    }
}, {
    timestamps: true
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {     // Skip if password is unchanged
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

// Instance method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;