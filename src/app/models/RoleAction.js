const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const roleactionSchema = new mongoose.Schema(
    {
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
        },
        listAction: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Action',
            required: true,
        }],
        createdTime: {
            type: Date,
            default: Date.now()
        },    
        updatedTime: {
            type: Date,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { collection: 'RoleAction' },
    { timestamps: true }
)
roleactionSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('roleaction', roleactionSchema)