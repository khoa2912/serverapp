const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const infoProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        type: {
            type: String,
            // required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { collection: 'infoProduct' },
    { timestamps: true }
)
infoProductSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('infoProduct', infoProductSchema)