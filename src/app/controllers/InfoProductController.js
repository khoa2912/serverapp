const shortid = require('shortid')
const slugify = require('slugify')
const { json } = require('express')
const InfoProduct = require('../models/infoProduct')
// eslint-disable-next-line import/order
const ObjectId = require('mongodb')


// eslint-disable-next-line no-var
class InfoProductController {
    async createInfoProduct(req, res, next) {
        if(req.actions.includes('Them-thong-tin-loc-san-pham')) {
            const infoProduct = new InfoProduct({
                name: req.body.name,
                type: req.body.typeInfo,
                createdBy: req.user.id,
            })
            // eslint-disable-next-line consistent-return
            infoProduct.save((error, infoProduct) => {
                if (error) return res.status(400).json({ error })
                if (infoProduct) {
                    res.status(201).json({ infoProduct })
                }
            })
        } 
        else {
            return res.status(403).send('Khongduquyen');
        }
    }

    getInfoProducts = async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Headers', '*')
        res.header('Access-Control-Allow-Credentials', true)

        try {
            const infoProducts = await InfoProduct.find({})
                .populate(
                    { path: 'user', select: '_id firstname lastname' }
                )
                .exec()
            res.status(200).json({ infoProducts })
        } catch (error) {
            console.log(error)
        }
    }

    async updateInfoProduct(req, res, next) {
        if(req.actions.includes('Chinh-sua-thong-tin-loc-san-pham')) {
            InfoProduct.findOne({_id: req.body._id}, function(err, obj) {
                InfoProduct.updateOne(
                    { 
                        _id: req.body._id, 
                    },
                    {
                        $set: {
                            name: req.body.name,
                            type: req.body.type,
                            createdBy: obj.createdBy
                        }
                    }
                ).exec((error, infoProduct) => {
                    if (error) return res.status(400).json({ error })
                    if (infoProduct) {
                        res.status(201).json({ infoProduct })
                    }
                })
            });
        } 
        else {
            return res.status(403).send('Khongduquyen');
        }
    }

    deleteInfoProductById = (req, res) => {
        if(req.actions.includes('Xoa-thong-tin-loc-san-pham')) {
            const { infoProductId } = req.body.payload
            if (infoProductId) {
                InfoProduct.deleteMany({ _id: infoProductId }).exec((error, result) => {
                    if (error) return res.status(400).json({ error })
                    if (result) {
                        res.status(202).json({ result })
                    }
                })
            } else {
                res.status(400).json({ error: 'Params required' })
            }
        } 
        else {
            return res.status(403).send('Khongduquyen');
        }
    }

    getDataFilterInfoProduct = async (req, res, next) => {
        const options = {
            limit: 99,
            lean: true,
        }
        const searchModel = req.body
        const query = {}
        if (
            !!searchModel.TypeInfo &&
            Array.isArray(searchModel.TypeInfo) &&
            searchModel.TypeInfo.length > 0
        ) {
            query.type = { $in: searchModel.TypeInfo }
        }
        InfoProduct.paginate({ $and: [query] }, options).then(function (result) {
            return res.json({
                result,
            })
        })
    }

}
module.exports = new InfoProductController()
