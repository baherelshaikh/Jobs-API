const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    company: {
        type : String,
        required:[true,'Please provide company name'],
        maxlength: 50
    },
    position: {
        type: String,
        required:[true,'Please provide position'],
        maxlength: 100
    },
    status:{
        type: String,
        enum:['interview','declined','pending'],
        default:'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide user']
    }
    // to make mongoose create and manage (createdAt and updatedAt) properties by default
},{timestamps:true}) 

module.exports = mongoose.model('Job',jobSchema)