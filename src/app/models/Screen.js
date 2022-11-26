const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const screenSchema = new mongoose.Schema(
    {
        screenName: {
            type: String,
            // required: true,
            // unique: true,
        },
        screenSlug: {
            type: String,
            required: true,
            unique: true,
        },
        action: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Action',
            required: true,
        }],
        updatedTime: {
            type: Date,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { collection: 'Screen' },
    { timestamps: true }
)
screenSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Screen', screenSchema)
