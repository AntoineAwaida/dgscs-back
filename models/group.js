const mongoose = require('mongoose')


const GroupSchema = new mongoose.Schema({
    name:String,
    members:Array
})


const GroupModel = mongoose.model('Group', GroupSchema)

module.exports = GroupModel