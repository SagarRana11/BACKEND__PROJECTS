const mongoose = require('mongoose')
const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide product name"],
        maxlength: [100, "Name can't be longer than 100 character"]
    },
    price: {
        type: Number,
        required: [true, "Please provide product price"],
        default: 0,
    },
    description: {
        type: String,
        required: [true, "Please provide the product description"],
        maxlength: [1000, "The descriptio can't be longer than 1000 characters "],

    },
    image: {
        type: String,
        default: '/uploads/example.jppeg'
    },
    category: {
        type: String,
        required: [true, "Please provide product category"],
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
        type: String,
        required: [true, "Please provide product company"],
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
    },
    colors: {
        type: [String],
        default: ['#222'],
        required: true
    },
    featured: {
        type: Boolean,
        default: false,
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    inventory: {
        type: Number,
        required: true,
        default: 15,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timeStamp: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
});

ProductSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });

})

module.exports = mongoose.model('Product', ProductSchema);