const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctOption: {
            type: Number,
            required: true,
            min: 0,
            max: 3
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to validate exactly 5 questions
quizSchema.pre('save', function(next) {
    if (this.questions.length !== 5) {
        next(new Error('Quiz must contain exactly 5 questions'));
    }
    next();
});

// Middleware to validate 4 options per question
quizSchema.pre('save', function(next) {
    const invalidQuestions = this.questions.filter(q => q.options.length !== 4);
    if (invalidQuestions.length > 0) {
        next(new Error('Each question must have exactly 4 options'));
    }
    next();
});

module.exports = mongoose.model('Quiz', quizSchema);