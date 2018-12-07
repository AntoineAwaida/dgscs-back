const mongoose = require('mongoose')


const GroupSchema = new mongoose.Schema({
    name:String,
    members:Array,
    workpackages:[{type: mongoose.Schema.Types.ObjectId, ref: 'WorkPackage'}]
})


const GroupModel = mongoose.model('Group', GroupSchema)

module.exports = GroupModel