const express = require('express')
const RoleActionController = require('../app/controllers/RoleActionController')

const router = express.Router()
const { requireSignin } = require('../middleware')

router.post('/createRoleAction', requireSignin, RoleActionController.createRoleAction)
router.post(`/getDataFilterRoleAction`, requireSignin, RoleActionController.getDataFilterRoleAction)
router.post(`/getRoleActions`, requireSignin, RoleActionController.getRoleActions)
router.post(
    '/updateRoleAction',
    requireSignin,
    RoleActionController.updateRoleAction
)
router.delete(
    '/deleteRoleActionById',
    requireSignin,
    // adminMiddleware,
    RoleActionController.deleteRoleActionById
)

module.exports = router