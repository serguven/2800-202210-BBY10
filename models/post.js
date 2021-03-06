const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bby_10_user',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    postImage: {
        type: [String],
        //required: true,
    }
}, {timestamps: true});

const Post = mongoose.model('bby_10_post', postSchema);

module.exports = Post;