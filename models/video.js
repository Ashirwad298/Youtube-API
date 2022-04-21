const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: String,
    video_id: String,
    description: String,
    channel_id: String,
    channel_title: String,
    thumbnailURL:String,
    publishedDateTime: Date
});


module.exports = mongoose.model('video', videoSchema);