const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
 
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required : true },

})


const ReportModel = mongoose.model('Report', ReportSchema)

module.exports = ReportModel