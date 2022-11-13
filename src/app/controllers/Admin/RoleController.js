const shortid = require('shortid')
const slugify = require('slugify')
const { json } = require('express')
const Role = require('../../models/Role')
const ObjectId = require('mongodb').ObjectID
const NodeCache = require('node-cache')
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

class RoleController {
    async create(req, res, next) {
        if(req.actions.includes('Them-role')) {
            const role = new Role({
                nameRole: req.body.nameRole,
                description: req.body.description,
                createdBy: req.user.id,
            })
            // eslint-disable-next-line no-shadow, consistent-return
            role.save((error, role) => {
                if (error) return res.status(400).json({ error })
                if (role) {
                    res.status(201).json({ role })
                }
            })
        } 
        else {
            return res.status(403).send('Khongduquyen');
        }
    }

    getRoles = async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Headers', '*')
        res.header('Access-Control-Allow-Credentials', true)

        try {
            const roles = await Role.find({})
                .populate(
                    { path: 'user', select: '_id firstname lastname' }
                )
                .exec()
            res.status(200).json({ roles })
        } catch (error) {
            console.log(error)
        }
    }

    async updateRole(req, res, next) {
        if(req.actions.includes('Chinh-sua-role')) {
            Role.findOne({_id: req.body._id}, function(err, obj) {
                Role.updateOne(
                    { 
                        _id: req.body._id, 
                    },
                    {
                        $set: {
                            nameRole: req.body.nameRole,
                            description: req.body.description,
                            createdTime: obj.createdTime,
                            createdBy: obj.createdBy
                        }
                    }
                ).exec((error, role) => {
                    if (error) return res.status(400).json({ error })
                    if (role) {
                        res.status(201).json({ role })
                    }
                })
            });
        } 
        else {
            return res.status(403).send('Khongduquyen');
        }
    }

    deleteRoleById = (req, res) => {
        if(req.actions.includes('Xoa-role')) {
            const { roleId } = req.body.payload
            if (roleId) {
                Role.deleteMany({ _id: roleId }).exec((error, result) => {
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

    getDataFilterRole = async (req, res, next) => {
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
        console.log(req.body)
        const searchModel = req.body
        const query = {}
        if (
            !!searchModel.RoleID &&
            Array.isArray(searchModel.RoleID) &&
            searchModel.RoleID.length > 0
        ) {
            query._id = { $in: searchModel.RoleID }
        }
        Role.paginate({ $and: [query] }, options).then(function (result) {
            return res.json({
                result,
            })
        })
    }

    // async permissionRole(req, res, next) {
    //     try {
    //         const { codeSreen, codeRole } = req.body
    //         Role.findOneAndUpdate(
    //             { codeRole },
    //             { $set: { codeSreen } },
    //             { new: true },
    //             (err, role) => {
    //                 if (err) {
    //                     res.status(400).json({ error: 'error' })
    //                 }
    //                 res.status(200).json({ message: 'success' })
    //             }
    //         )
    //     } catch (e) {
    //         res.status(400).json({ error: 'error' })
    //     }
    // }
}
module.exports = new RoleController()
