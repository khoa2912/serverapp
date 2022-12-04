const shortid = require('shortid')
const slugify = require('slugify')
const { json } = require('express')
const Tag = require('../models/Tag')
// eslint-disable-next-line import/order
const ObjectId = require('mongodb')
const NodeCache = require('node-cache')
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

// eslint-disable-next-line no-var
class TagController {
    async createTag(req, res, next) {
        try {
            if (req.actions.includes('Them-tag')) {
                const tag = new Tag({
                    parentId: req.body.parentId,
                    tagName: req.body.tagName,
                    tagSlug: slugify(req.body.tagName),
                    createdTime: Date.now(),
                    updatedTime: req.body.updatedTime,
                    createdBy: req.user.id,
                })
                // eslint-disable-next-line consistent-return
                tag.save((error, tag) => {
                    if (error) return res.status(400).json({ error })
                    if (tag) {
                        res.status(201).json({ tag })
                    }
                })
            } else {
                return res.status(403).send('Khongduquyen')
            }
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getTags = async (req, res) => {
        try {
            const tags = await Tag.find({})
                .populate({ path: 'user', select: '_id firstname lastname' })
                .populate({ path: 'parentId' })
                .exec()
            res.status(200).json({ tags })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    async updateTag(req, res, next) {
        try {
            if (req.actions.includes('Chinh-sua-tag')) {
                Tag.findOne({ _id: req.body._id }, function (err, obj) {
                    Tag.updateOne(
                        {
                            _id: req.body._id,
                        },
                        {
                            $set: {
                                tagName: req.body.tagName,
                                tagSlug: slugify(req.body.tagName),
                                createdTime: obj.createdTime,
                                updatedTime: req.body.updatedTime,
                                createdBy: obj.createdBy,
                            },
                        }
                    ).exec((error, tag) => {
                        if (error) return res.status(400).json({ error })
                        if (tag) {
                            res.status(201).json({ tag })
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

    deleteTagById = (req, res) => {
        try {
            if (req.actions.includes('Xoa-tag')) {
                const { tagId } = req.body.payload
                if (tagId) {
                    Tag.deleteMany({ _id: tagId }).exec((error, result) => {
                        if (error) return res.status(400).json({ error })
                        if (result) {
                            res.status(202).json({ result })
                        }
                    })
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

    getDataFilterTag = async (req, res, next) => {
        try {
            const options = {
                limit: 99,
                lean: true,
            }
            console.log(req.body)
            const searchModel = req.body
            const query = {}
            if (
                !!searchModel.TagName &&
                Array.isArray(searchModel.TagName) &&
                searchModel.TagName.length > 0
            ) {
                query.tagName = { $in: searchModel.TagName }
            }
            Tag.paginate({ $and: [query] }, options).then(function (result) {
                return res.json({
                    result,
                })
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
}
module.exports = new TagController()
