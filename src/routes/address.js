const express = require('express')
const AddressController = require('../app/controllers/AddressController')
const { userMiddleware, requireSignin } = require('../middleware')

const router = express.Router()

router.post(
    '/create',
    requireSignin,

    AddressController.addAddress
)
router.post(
    '/getaddress',
    requireSignin,

    AddressController.getAddress
)
router.post(
    '/deleteAddress',
    requireSignin,

    AddressController.deleteAddress
)
module.exports = router
