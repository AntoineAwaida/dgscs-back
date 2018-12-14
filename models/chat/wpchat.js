const mongoose = require('mongoose')

const WPChatSchema = new mongoose.Schema({


    content:String,
    date: Date,
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    wp:[{type: mongoose.Schema.Types.ObjectId, ref: 'WorkPackage'}]



})


WPChatSchema.pre('save', function(){

    let msg = this;
    msg.date = new Date(msg.date);

})


const WPChatModel = mongoose.model('WPChat', WPChatSchema)

module.exports = WPChatModel