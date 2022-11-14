const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const totalViewSchema = new mongoose.Schema(
    {
        view: {
            type: Number,
            required: true,
            unique: true
        },
        createdTime: {
            type: Date,
            default: Date.now()
        }
    },
    { collection: 'totalView' },
    { timestamps: true }
)
totalViewSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('totalView', totalViewSchema)