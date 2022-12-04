const shortid = require('shortid')
const slugify = require('slugify')
const { json } = require('express')
const Action = require('../models/Action')
// eslint-disable-next-line import/order
const ObjectId = require('mongodb')
const NodeCache = require('node-cache')
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

// eslint-disable-next-line no-var
class ActionController {
    async createAction(req, res, next) {
        try {
            if (req.actions.includes('Them-Action')) {
                const action = new Action({
                    actionName: req.body.actionName,
                    actionSlug: `${slugify(req.body.actionName)}`,
                    createdTime: Date.now(),
                    updatedTime: Date.now(),
                    createdBy: req.user.id,
                })
                console.log(action)
                // eslint-disable-next-line consistent-return
                action.save((error, result) => {
                    if (error) return res.status(400).json({ error })
                    if (result) {
                        res.status(201).json({ result })
                    }
                })
            } else {
                return res.status(403).send('Khongduquyen')
            }
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getActions = async (req, res) => {
        try {
            const actions = await Action.find({})
                .populate({ path: 'user', select: '_id firstname lastname' })
                .exec()
            res.status(200).json({ actions })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    async updateAction(req, res, next) {
        try {
            if (req.actions.includes('Chinh-sua-Action')) {
                Action.findOne({ _id: req.body._id }, function (err, obj) {
                    Action.updateOne(
                        {
                            _id: req.body._id,
                        },
                        {
                            $set: {
                                actionName: req.body.actionName,
                                actionSlug: `${slugify(req.body.actionName)}`,
                                createdTime: obj.createdTime,
                                updatedTime: req.body.updatedTime,
                                createdBy: obj.createdBy,
                            },
                        }
                    ).exec((error, action) => {
                        if (error) return res.status(400).json({ error })
                        if (action) {
                            res.status(201).json({ action })
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

    deleteActionById = (req, res) => {
        try {
            if (req.actions.includes('Xoa-Action')) {
                const { actionId } = req.body.payload
                if (actionId) {
                    Action.deleteMany({ _id: actionId }).exec(
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

    getDataFilterAction = async (req, res, next) => {
        try {
            const options = {
                limit: 99,
                lean: true,
            }
            const searchModel = req.body
            const query = {}
            if (
                !!searchModel.ActionName &&
                Array.isArray(searchModel.ActionName) &&
                searchModel.ActionName.length > 0
            ) {
                query.actionName = { $in: searchModel.ActionName }
            }
            Action.paginate({ $and: [query] }, options).then(function (result) {
                return res.json({
                    result,
                })
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
}
module.exports = new ActionController()
