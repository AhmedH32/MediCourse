const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const connectDB = require('../config/db');
const User = require('../models/User');


const seedAdmin = async () => {
    try {
        await connectDB();
        await User.deleteMany({ role: 'admin' });

        console.log('old admin removed (if exists)');

        const newAdmin = new User({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASS,
            name: 'maiada',
            role: 'admin'
        })
        
        await newAdmin.save();
        console.log('new admin created');

        process.exit(0);
    }
    catch (error) {
        console.log('couldnt seed admin');
        console.log(error.message);
        process.exit(1);
    }

}

seedAdmin();