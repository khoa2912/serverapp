const express = require('express')
const InfoProductController = require('../app/controllers/InfoProductController')

const router = express.Router()
const { requireSignin } = require('../middleware')

router.post('/createInfoProduct', requireSignin, InfoProductController.createInfoProduct)
router.post(`/getDataFilterInfoProduct`, requireSignin, InfoProductController.getDataFilterInfoProduct)
router.post(`/getInfoProducts`, requireSignin, InfoProductController.getInfoProducts)
router.post(
    '/updateInfoProduct',
    requireSignin,
    InfoProductController.updateInfoProduct
)
router.delete(
    '/deleteInfoProductById',
    requireSignin,
    // adminMiddleware,
    InfoProductController.deleteInfoProductById
)

module.exports = router