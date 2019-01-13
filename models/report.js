const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
 
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required : true },
    date: Date,

})

ReportSchema.pre('save', function(){

    let report = this;
    report.date = new Date();

})


const ReportModel = mongoose.model('Report', ReportSchema)

module.exports = ReportModel