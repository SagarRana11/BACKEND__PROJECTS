const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide username']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provise email'],
        validate: {
            validator: validator.isEmail,
            message: "Please provide valid email"
        }
    },
    password: {
        type: String,
        required: [true, 'Please provise email'],
        minLength: 6

    },
    verificationToken: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    verified: Date,
    passwordToken: {
        type: String,
    },
    passwordTokenExpirationDate: {
        type: Date
    }
})
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) return next();

    try {
        // Hash the password with bcrypt
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});

UserSchema.methods.comparePassword = async function(passwordString) {
    const ismatch = bcrypt.compare(passwordString, this.password)
    return ismatch
}

module.exports = mongoose.model('User', UserSchema)