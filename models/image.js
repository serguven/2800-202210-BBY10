var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Image', imageSchema);