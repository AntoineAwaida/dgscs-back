const mongoose = require('mongoose')


const FileSchema = new mongoose.Schema(
    {
        name: String,
        fileURL : String,
        description : { type : String, required : false },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required : true },
        date : Date
    }
);

const FileModel = mongoose.model('File', FileSchema)

module.exports = FileModel