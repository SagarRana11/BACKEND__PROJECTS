const express = require('express')
const router = express.Router()
const {
    createProduct,
    getAllProducts,
} = require('../controllers/productController')

const { uploadProductImageLocal } = require('../controllers/uploadController')

router.route('/').get(getAllProducts).post(createProduct)
router.route('/uploads').post(uploadProductImageLocal)

module.exports = router