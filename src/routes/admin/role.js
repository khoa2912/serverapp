const router = require('express').Router()
const RoleController = require('../../app/controllers/Admin/RoleController')
const {
    requireSignin,
    userMiddleware,
    adminMiddleware,
} = require('../../middleware')
router.delete(
    '/deleteRoleById',
    requireSignin,
    // adminMiddleware,
    RoleController.deleteRoleById
)
router.post(
    '/updateRole',
    requireSignin,
    RoleController.updateRole
)
router.post('/create', requireSignin, RoleController.create)
router.post('/getRoles', requireSignin, RoleController.getRoles)
router.post('/getDataFilterRole', requireSignin, RoleController.getDataFilterRole)
module.exports = router
