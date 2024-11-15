const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 5,
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide email"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Please provide Password"],
        minlength: 6
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
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
        type: Date,
    },
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
UserSchema.methods.comparePassword = async function (passwordString) {
    console.log(passwordString)
    console.log(this.password)
    const ismatch = await bcrypt.compare(passwordString, this.password)
    return ismatch
}
module.exports = mongoose.model('User', UserSchema)