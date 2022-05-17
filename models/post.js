const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    }
})

const Post = mongoose.model('bby-10-post', postSchema);

module.exports = Post;