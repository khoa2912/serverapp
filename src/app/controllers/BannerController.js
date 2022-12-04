const shortid = require('shortid')
const slugify = require('slugify')
const { json } = require('express')
const Banner = require('../models/Banner')
// eslint-disable-next-line import/order
const ObjectId = require('mongodb')
const NodeCache = require('node-cache')
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

// eslint-disable-next-line no-var
class BannerController {
    async createBanner(req, res, next) {
        try {
            const { nameBanner, codeBanner, image, slug } = req.body

            const banner = new Banner({
                nameBanner,
                codeBanner,
                image,
                slug,
                createdBy: req.user.id,
            })
            // eslint-disable-next-line consistent-return
            banner.save((error, banner) => {
                if (error) return res.status(400).json({ error })
                if (banner) {
                    res.status(201).json({ banner })
                }
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getBanners = async (req, res) => {
        try {
            const banners = await Banner.find({})
                .populate({ path: 'user', select: '_id firstname lastname' })
                .exec()
            res.status(200).json({ banners })
        } catch (error) {
            res.status(400).json({ error })
        }
    }

    async getAllBanners(req, res, next) {
        try {
            const allBanners = await Banner.find({}).populate({
                path: 'user',
                select: '_id firstname lastname',
            })
            if (allBanners) {
                res.status(200).json({ allBanners })
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    }

    async updateBanner(req, res, next) {
        try {
            Banner.findOneAndUpdate(
                { _id: req.body._id },
                {
                    $set: {
                        nameBanner: req.body.nameBanner,
                        codeBanner: req.body.codeBanner,
                        image: req.body.image,
                        slug: req.body.slug,
                    },
                },
                { new: true, upsert: true }
            ).exec((error, result) => {
                console.log(error)
                if (error) return res.status(400).json({ error })
                if (result) {
                    res.status(201).json({ result })
                }
            })
        } catch (error) {
            res.status(400).json({ error })
        }
    }

    deleteBannerById = (req, res) => {
        try {
            const { bannerId } = req.body.payload
            if (bannerId) {
                Banner.deleteMany({ _id: bannerId }).exec((error, result) => {
                    if (error) return res.status(400).json({ error })
                    if (result) {
                        res.status(202).json({ result })
                    }
                })
            } else {
                res.status(400).json({ error: 'Params required' })
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    }

    getDataFilterBanner = async (req, res, next) => {
        try {
            const options = {
                limit: 99,
                lean: true,
            }
            const searchModel = req.body
            const query = {}
            if (
                !!searchModel.BannerName &&
                Array.isArray(searchModel.BannerName) &&
                searchModel.BannerName.length > 0
            ) {
                query.nameBanner = { $in: searchModel.BannerName }
            }

            if (
                !!searchModel.Banner_Code &&
                Array.isArray(searchModel.Banner_Code) &&
                searchModel.Banner_Code.length > 0
            ) {
                query.codeBanner = { $in: searchModel.Banner_Code }
            }

            Banner.paginate({ $and: [query] }, options).then(function (result) {
                return res.json({
                    result,
                })
            })
        } catch (error) {
            res.status(400).json({ error })
        }
    }
}
module.exports = new BannerController()
