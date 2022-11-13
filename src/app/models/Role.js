const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const roleSchema = new mongoose.Schema(
    {
        nameRole: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
        },
        createdTime: {
            type: Date,
            default: Date.now()
        },    
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updateAt: Date,
    },
    { collection: 'Role' },
    { timestamps: true }
)

roleSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Role', roleSchema)
