const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    completionStatus: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Certificate', certificateSchema)