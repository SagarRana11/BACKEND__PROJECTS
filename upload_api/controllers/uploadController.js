const path = require('path')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const uploadProductImageLocal = async (req, res) => {
    if (!req.files) {
        throw CustomError.BadRequestError('No File Uploaded')
    }
    console.log("inside uploadProductImageLocal printing req.files", req.files)

    const productImage = req.files.image;
    console.log("printing the input object", productImage)
    if (!productImage.mimetype.startsWith('image')) {
        throw CustomError.BadRequestError('Please upload image')

    }
    const maxSize = 1024 * 1024
    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError('Please upload image smaller than 1 mb')
    }
    const imagePath = path.join(
        __dirname,
        '../public/uploads/' + `${productImage.name}`
    )
    console.log(imagePath)
    await productImage.mv(imagePath)
    return res
        .status(StatusCodes.OK)
        .json({ image: { src: `/uploads/${productImage.name}` } })
};

const uploadProductImage = async (req, res) => {
    console.log(req.files.image)
    const result = await cloudinary.uploader.upload(
        // req.files.image.tempFilePath this is the url
        req.files.image.tempFilePath, {
        use_filename: true,
        folder: 'file-upload',
    }
    )
    console.log(result)
    // deleting the temp url
    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });

}

module.exports = {
    uploadProductImageLocal,
};