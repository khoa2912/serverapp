const express = require('express')

const router = express.Router()
const multer = require('multer')
const shortid = require('shortid')
const path = require('path')
const { requireSignin, adminMiddleware } = require('../middleware')
const CategoryController = require('../app/controllers/CategoryController')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename(req, file, cb) {
        cb(null, `${shortid.generate()}-${file.originalname}`)
    },
})

const upload = multer({ storage })

router.post(
    '/create',
    requireSignin,
    // adminMiddleware,
    upload.single('categoryImage'),
    CategoryController.create
)
router.get('/getcategory', CategoryController.getCategories)
router.post('/getDataFilter', CategoryController.getDataFilter)
router.post(
    '/update',
    upload.array('categoryImage'),
    requireSignin,
    CategoryController.updateCategories
)
router.post('/delete', requireSignin, CategoryController.deleteCategories)
module.exports = router
