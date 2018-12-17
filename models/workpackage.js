const mongoose = require('mongoose')

const WorkPackageSchema = new mongoose.Schema({
    
    name:{ type:String, required:true},
    description:String,
    tasks:[String],
    status:{type: String, default:'active', required:true, enum:['active','inactive','readonly']},
    groups:[{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}],
    files:[String]

   

})


const WorkPackageModel = mongoose.model('WorkPackage', WorkPackageSchema)

module.exports = WorkPackageModel