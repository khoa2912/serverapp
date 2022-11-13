const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const actionSchema = new mongoose.Schema(
    {
        actionName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        actionSlug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
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
    { collection: 'Action' },
    { timestamps: true }
)
actionSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Action', actionSchema)