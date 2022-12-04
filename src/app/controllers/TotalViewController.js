const shortid = require('shortid')
const slugify = require('slugify')
const { json } = require('express')
const Product = require('../models/Product')
const totalView = require('../models/totalView')
// eslint-disable-next-line import/order
const ObjectId = require('mongodb')

// eslint-disable-next-line no-var
class TotalViewController {
    async createTotalView(req, res, next) {
        try {
            const total = new totalView({
                view: req.body.totalView,
            })
            // eslint-disable-next-line consistent-return
            total.save((error, total) => {
                if (error) return res.status(400).json({ error })
                if (total) {
                    res.status(201).json({ total })
                }
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getTotalViews = async (req, res) => {
        try {
            const total = await totalView.find({}).exec()
            res.status(200).json({ total })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
}
module.exports = new TotalViewController()
