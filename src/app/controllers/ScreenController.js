const shortid = require('shortid')
const slugify = require('slugify')
const { json } = require('express')
const Screen = require('../models/Screen')
const Action = require('../models/Action')
// eslint-disable-next-line import/order
const ObjectId = require('mongodb').ObjectID
// eslint-disable-next-line no-var
var cloudinary = require('cloudinary').v2

cloudinary.config({
    // eslint-disable-next-line camelcase
    cloud_name: 'shoplaptop',
    // eslint-disable-next-line camelcase
    api_key: '672421112872878',
    // eslint-disable-next-line camelcase
    api_secret: 'zmqOX3J_4CliR5GifTptxoceHro',
    secure: true,
})
class ScreenController {
    async createScreen(req, res, next) {
        try {
            const screen = new Screen({
                screenName: req.body.screenName,
                screenSlug: req.body.screenSlug,
                action: req.body.action,
                updatedTime: req.body.updatedTime,
                createdBy: req.user.id,
            })
            // eslint-disable-next-line consistent-return
            screen.save((error, screen) => {
                if (error) return res.status(400).json({ error })
                if (screen) {
                    res.status(201).json({ screen })
                }
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getScreens = async (req, res) => {
        try {
            const screens = await Screen.find({})
                .populate({ path: 'user' })
                .exec()
            res.status(200).json({ screens })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    deleteScreenById = (req, res) => {
        try {
            const { screenId } = req.body.payload
            if (screenId) {
                Screen.deleteMany({ _id: screenId }).exec((error, result) => {
                    if (error) return res.status(400).json({ error })
                    if (result) {
                        res.status(202).json({ result })
                    }
                })
            } else {
                res.status(400).json({ error: 'Params required' })
            }
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    async updateScreen(req, res, next) {
        try {
            Screen.findOne({ _id: req.body._id }, function (err, obj) {
                Screen.updateOne(
                    {
                        _id: req.body._id,
                    },
                    {
                        $set: {
                            screenName: req.body.screenName,
                            screenSlug: req.body.screenSlug,
                            action: req.body.action,
                            updatedTime: req.body.updatedTime,
                        },
                    }
                ).exec((error, screen) => {
                    if (error) return res.status(400).json({ error })
                    if (screen) {
                        res.status(201).json({ screen })
                    }
                })
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getDataFilterScreen = async (req, res, next) => {
        try {
            const options = {
                limit: 99,
                lean: true,
                populate: [{ path: 'user' }],
            }
            console.log(req.body)
            const searchModel = req.body
            const query = {}
            if (!!searchModel.Screen_Name) {
                query.screenName = { $in: searchModel.Screen_Name }
            }
            Screen.paginate({ $and: [query] }, options).then(function (result) {
                return res.json({
                    result,
                })
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
}
module.exports = new ScreenController()
