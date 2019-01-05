const mongoose = require('mongoose')

const TaskChatSchema = new mongoose.Schema({


    content:String,
    date: Date,
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    task:[{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]



})


TaskChatSchema.pre('save', function(){

    let msg = this;
    msg.date = new Date(msg.date);

})


const TaskChatModel = mongoose.model('TaskChat', TaskChatSchema)

module.exports = TaskChatModel