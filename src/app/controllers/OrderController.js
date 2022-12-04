const Order = require('../models/Order')
const Cart = require('../models/Cart')
const shortid = require('shortid')
const slugify = require('slugify')
const Address = require('../models/Address')
const { isValidObjectId } = require('mongoose')
var ObjectId = require('mongodb').ObjectId

class OrderController {
    create(req, res, next) {
        try {
            let itemTable = [
                {
                    productId: req.body.productId,
                    purchasedQty: req.body.purchasedQty,
                },
            ]

            let orderStatusTable = [
                {
                    isCompleted: req.body.isCompleted,
                    type: req.body.type,
                },
            ]

            const order = new Order({
                addressId: req.body.addressId,
                totalAmount: req.body.totalAmount,
                items: itemTable,
                paymentStatus: req.body.paymentStatus,
                paymentType: req.body.paymentType,
                user: req.body.user,
                orderStatus: orderStatusTable,
            })

            order.save((error, order) => {
                if (error) return res.status(400).json({ error })
                if (order) {
                    return res.status(201).json({ order })
                }
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    addOrder = (req, res) => {
        try {
            Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
                if (error) return res.status(400).json({ error })
                if (result) {
                    req.body.user = req.user._id
                    req.body.orderStatus = [
                        {
                            type: 'ordered',
                            date: new Date(),
                            isCompleted: true,
                        },
                        {
                            type: 'packed',
                            isCompleted: false,
                        },
                        {
                            type: 'shipped',
                            isCompleted: false,
                        },
                        {
                            type: 'delivered',
                            isCompleted: false,
                        },
                    ]
                    const order = new Order(req.body)
                    order.user = req.user.id
                    order.save((error, order) => {
                        if (error) return res.status(400).json({ error })
                        if (order) {
                            res.status(201).json({ order })
                        }
                    })
                }
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getOrders = (req, res) => {
        try {
            Order.find({ user: req.user.id })
                .populate(
                    { path: 'category', select: '_id name' },
                    { path: 'user', select: '_id firstname lastname' }
                )
                .exec((error, orders) => {
                    if (error) return res.status(400).json({ error })
                    if (orders) {
                        res.status(200).json({ orders })
                    }
                })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getOrder = (req, res) => {
        try {
            let query = {}
            if (ObjectId.isValid(req.body.orderId)) {
                query = { _id: req.body.orderId }
            } else {
                query = { id: req.body.orderId }
            }
            Order.findOne(query)
                .populate(
                    'items.productId',
                    '_id name productPicture salePrice'
                )
                .lean()
                .exec((error, order) => {
                    console.log(error)
                    if (error) return res.status(400).json({ error })
                    if (order) {
                        Address.findOne({
                            user: req.user.id,
                        }).exec((error, address) => {
                            if (error) return res.status(400).json({ error })
                            order.address = address.address.find(
                                (adr) =>
                                    adr._id.toString() ==
                                    order.addressId.toString()
                            )
                            res.status(200).json({
                                order,
                            })
                        })
                    }
                })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
    cancelOrder = (req, res) => {
        try {
            Order.findOneAndUpdate(
                { _id: req.body.data.payload.orderId },
                { $set: { paymentStatus: 'cancelled' } },
                { new: true, upsert: true }
            ).exec((error, result) => {
                if (error) return res.status(400).json({ error })
                if (result) {
                    res.status(202).json({ result })
                }
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    getDataFilterOrder = async (req, res, next) => {
        try {
            const options = {
                limit: 99,
                lean: true,
                populate: [
                    {
                        path: 'user',
                        select: '_id firstname lastname',
                    },
                ],
            }
            const searchModel = req.body
            const query = {}
            if (
                !!searchModel.TotalAmount &&
                Array.isArray(searchModel.TotalAmount) &&
                searchModel.TotalAmount.length > 0
            ) {
                query._id = { $in: searchModel.TotalAmount }
            }

            if (!!searchModel.UserId && searchModel.UserId.length > 0) {
                query.user = { $in: searchModel.UserId }
            }
            Order.paginate({ $and: [query] }, options).then(function (result) {
                return res.json({
                    result,
                })
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }
    searchOrders = async (req, res, next) => {
        const { q, sortOrder, sortBy, userId } = req.body.data.payload
        const listQuery = []
        if (q !== '') {
            const searchName = q
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`)
            const searchNameRgx = rgx(searchName)

            if (userId) {
                const searchQuery = {
                    $match: {
                        name: { $regex: searchNameRgx, $options: 'i' },
                        category: ObjectId(userId),
                    },
                }
                listQuery.push(searchQuery)
            } else {
                const searchQuery = {
                    $match: { name: { $regex: searchNameRgx, $options: 'i' } },
                }
                listQuery.push(searchQuery)
            }
        }
        if (sortBy) {
            const order = sortOrder === 'asc' ? 1 : -1
            listQuery.push({ $sort: { [sortBy]: order } })
        }
        try {
            const ordersFilter = await Order.aggregate(listQuery).exec()
            if (ordersFilter) {
                res.status(200).json({ productsSearch: ordersFilter })
            }
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    updateCompletedOrder = (req, res) => {
        Order.findOneAndUpdate(
            { _id: req.body.data.payload.orderId },
            { $set: { paymentStatus: 'completed' } },
            { new: true, upsert: true }
        ).exec((error, result) => {
            if (error) return res.status(400).json({ error })
            if (result) {
                res.status(202).json({ result })
            }
        })
    }
}
module.exports = new OrderController()
