const mongoose = require('mongoose')


const TaskSchema = new mongoose.Schema(
    {
        name: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        description: String,
        groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
        startingDate: Date,
        endingDate: Date,
        files : { type : [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }], default : []},
        status: { type: String, required: true, enum: ['done', 'ongoing', 'pending'], default: 'pending' },
    } 
);

const TaskModel = mongoose.model('Task', TaskSchema)

module.exports = TaskModel