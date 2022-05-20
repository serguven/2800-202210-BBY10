const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bby-10-user',
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

const Post = mongoose.model('bby-10-post', postSchema);

module.exports = Post;