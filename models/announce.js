const mongoose = require('mongoose')

const AnnounceSchema = new mongoose.Schema({


    content:String,
    date: Date,
    author: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    title:String,



})


AnnounceSchema.pre('save', function(){

    let announce = this;
    announce.date = new Date();

})


const AnnounceModel = mongoose.model('Announce', AnnounceSchema)

module.exports = AnnounceModel