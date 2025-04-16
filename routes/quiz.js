const express = require('express');
const router = express.Router();
const { auth, isInstructor } = require('../middleware/auth');
const {
    createQuiz,
    getQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuizAttempt
} = require('../controllers/quiz');

// Quiz routes
router.post('/create', auth, isInstructor, createQuiz);
router.get('/:courseId', auth, getQuiz);
router.put('/update', auth, isInstructor, updateQuiz);
router.delete('/:courseId', auth, isInstructor, deleteQuiz);
router.post('/submit', auth, submitQuizAttempt);

module.exports = router;