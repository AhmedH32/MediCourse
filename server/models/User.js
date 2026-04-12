const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: 8,
        select: false
    },
    name: {
        type: String,
        required: [true,'Name is required'],
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student'
    },
    isDeviceLocked: {
        type: Boolean,
        default: false
    },
    deviceFingerprint: {
        type: String,
        default: null
    },
    resetToken: {
        type: String,
        default: null
    }
},{
    timestamps: true
});
//might add hashing method for the reset token later


userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))
    {
        return next();
    }
    const salt = await bcrypt.getSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.matchPassword(enteredPassword, this.password);
    
};

module.exports = mongoose.model('User', userSchema);