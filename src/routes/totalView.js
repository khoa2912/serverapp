const express = require('express')
const TotalViewController = require('../app/controllers/TotalViewController')

const router = express.Router()
const { requireSignin } = require('../middleware')

router.post('/createTotalView', requireSignin, TotalViewController.createTotalView)
router.post('/getTotalViews', TotalViewController.getTotalViews)

module.exports = router