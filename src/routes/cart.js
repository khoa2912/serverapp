const express = require('express')

const router = express.Router()
const CartController = require('../app/controllers/CartController')
const { requireSignin, userMiddleware } = require('../middleware')

router.post('/addtocart', requireSignin, CartController.addItemToCart)
router.post('/getCartItems', requireSignin, CartController.getCartItems)
router.post('/removeItem', requireSignin, CartController.removeCartItems)
router.delete('/allCart', requireSignin, CartController.deleteAllProductCart)
module.exports = router
