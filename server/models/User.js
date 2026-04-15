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
        required: [true, 'Name is required'],
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student'
    },
    deviceBinding: {
        deviceUUID: {
            type: String,
            default: null
        },
        fingerprintSnapshot: {
            os: { type: String },
            browser: { type: String },
            language: { type: String },
            timeZone: { type: String },
            resolution: { type: String },
            hardwareConcurrency: { type: Number },
            touchSupport: { type: Boolean },
            canvasHash: { type: String }
        },
        boundAt: {
            type: Date
        },
        lastValidatedAt: { type: Date },
        resetHistory: [
            {
                resetAt: { type: Date, default: Date.now },
                reason: { type: String, default: '' },
                resetBy: { type: mongoose.Schema.Types.ObjectId, ref:'User'}
            }
        ]
    },
    resetToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});
//might add hashing method for the reset token later


userSchema.pre('save', async function(next){
    try{
        if(!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch(error)
    {
        console.log(error);
        next(error);
    }
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);

};

module.exports = mongoose.model('User', userSchema);