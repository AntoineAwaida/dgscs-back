const mongoose = require('mongoose')


const GroupSchema = new mongoose.Schema({
    name:String,
    members:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    workpackages:[{type: mongoose.Schema.Types.ObjectId, ref: 'WorkPackage'}]
})


const GroupModel = mongoose.model('Group', GroupSchema)

module.exports = GroupModel