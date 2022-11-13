const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect(
            'mongodb+srv://dangkhoa:Khoa%40%40291299@dangkhoa.agdx452.mongodb.net/DbShoplaptop?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            }
        )
        console.log('Connect successfully!!!')
    } catch (error) {
        console.log('Connect failure!!!')
    }
}
module.exports = { connect }
