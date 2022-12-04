const shortid = require('shortid')
const slugify = require('slugify')
const { json } = require('express')
const RoleAction = require('../models/RoleAction')
const Action = require('../models/Action')
const Role = require('../models/Role')
// eslint-disable-next-line import/order
const ObjectId = require('mongodb')
const NodeCache = require('node-cache')

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

// eslint-disable-next-line no-var
class RoleActionController {
    async createRoleAction(req, res, next) {
        try {
            if (req.actions.includes('Them-Role-Action')) {
                const roleaction = new RoleAction({
                    roleId: req.body.roleId,
                    listAction: req.body.listAction,
                    createdTime: Date.now(),
                    updatedTime: Date.now(),
                    createdBy: req.user.id,
                })
                // eslint-disable-next-line consistent-return
                roleaction.save((error, roleaction) => {
                    if (error) return res.status(400).json({ error })
                    if (roleaction) {
                        res.status(201).json({ roleaction })
                    }
                })
            } else {
                return res.status(403).send('Khongduquyen')
            }
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getRoleActions = async (req, res) => {
        try {
            const roleactions = await RoleAction.find({})
                .populate({ path: 'role', select: '_id nameRole' })
                .populate({ path: 'action', select: '_id nameAction' })
                .populate({ path: 'user', select: '_id firstname lastname' })
                .exec()
            res.status(200).json({ roleactions })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    async updateRoleAction(req, res, next) {
        try {
            if (req.actions.includes('Chinh-sua-Role-Action')) {
                RoleAction.findOne({ _id: req.body._id }, function (err, obj) {
                    RoleAction.updateOne(
                        {
                            _id: req.body._id,
                        },
                        {
                            $set: {
                                roleId: req.body.roleId,
                                listAction: req.body.listAction,
                                createdTime: obj.createdTime,
                                updatedTime: req.body.updatedTime,
                                createdBy: obj.createdBy,
                            },
                        }
                    ).exec((error, roleaction) => {
                        if (error) return res.status(400).json({ error })
                        if (roleaction) {
                            res.status(201).json({ roleaction })
                        }
                    })
                })
            } else {
                return res.status(403).send('Khongduquyen')
            }
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    deleteRoleActionById = (req, res) => {
        try {
            if (req.actions.includes('Xoa-Role-Action')) {
                const { roleactionId } = req.body.payload
                if (roleactionId) {
                    RoleAction.deleteMany({ _id: roleactionId }).exec(
                        (error, result) => {
                            if (error) return res.status(400).json({ error })
                            if (result) {
                                res.status(202).json({ result })
                            }
                        }
                    )
                } else {
                    res.status(400).json({ error: 'Params required' })
                }
            } else {
                return res.status(403).send('Khongduquyen')
            }
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getDataFilterRoleAction = async (req, res, next) => {
        try {
            const options = {
                limit: 99,
                lean: true,
                populate: [
                    { path: 'roleId', select: '_id nameRole' },
                    { path: 'user', select: '_id firstname lastname' },
                ],
            }
            const searchModel = req.body
            const query = {}
            if (
                !!searchModel.RoleID &&
                Array.isArray(searchModel.RoleID) &&
                searchModel.RoleID.length > 0
            ) {
                query.roleId = { $in: searchModel.RoleID }
            }
            RoleAction.paginate({ $and: [query] }, options).then(function (
                result
            ) {
                return res.json({
                    result,
                })
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
}
module.exports = new RoleActionController()
