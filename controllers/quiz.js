const Quiz = require('../models/quiz');
const Course = require('../models/course');
const QuizAttempt = require('../models/quizAttempt');

// Create a quiz for a course
exports.createQuiz = async (req, res) => {
    try {
        const { courseId, questions } = req.body;

        if (!courseId || !questions) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if quiz already exists for this course
        const existingQuiz = await Quiz.findOne({ course: courseId });
        if (existingQuiz) {
            // Update existing quiz
            existingQuiz.questions = questions;
            existingQuiz.updatedAt = Date.now();
            await existingQuiz.save();

            return res.status(200).json({
                success: true,
                message: 'Quiz updated successfully',
                quiz: existingQuiz
            });
        }

        // Validate questions format and count
        if (!Array.isArray(questions) || questions.length !== 5) {
            return res.status(400).json({
                success: false,
                message: 'Exactly 5 questions are required'
            });
        }

        // Validate each question
        for (const question of questions) {
            if (!question.questionText || !question.options || 
                !Array.isArray(question.options) || 
                question.options.length !== 4 || 
                typeof question.correctOption !== 'number' || 
                question.correctOption < 0 || 
                question.correctOption > 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid question format. Each question must have text, 4 options, and a valid correct option index'
                });
            }
        }

        // Create quiz
        const quiz = await Quiz.create({
            course: courseId,
            questions
        });

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            quiz
        });

    } catch (error) {
        console.error('Error in createQuiz: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create quiz',
            error: error.message
        });
    }
};

// Submit quiz attempt
exports.submitQuizAttempt = async (req, res) => {
    try {
        const { courseId, answers } = req.body;
        const userId = req.user.id;

        // Find the quiz for this course
        const quiz = await Quiz.findOne({ course: courseId });
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found for this course'
            });
        }

        // Validate answers format
        if (!Array.isArray(answers) || answers.length !== 5) {
            return res.status(400).json({
                success: false,
                message: 'Must provide answers for all 5 questions'
            });
        }

        // Calculate score and mark correct/incorrect answers
        let score = 0;
        const gradedAnswers = answers.map((answer, index) => {
            const isCorrect = answer === quiz.questions[index].correctOption;
            if (isCorrect) score++;
            return {
                questionIndex: index,
                selectedOption: answer,
                isCorrect
            };
        });

        // Create quiz attempt record
        const quizAttempt = new QuizAttempt({
            quiz: quiz._id,
            user: userId,
            course: courseId,
            answers: gradedAnswers,
            score,
            passed: score === 5,
            attemptDate: new Date()
        });

        // Save the quiz attempt
        await quizAttempt.save();

        res.status(200).json({
            success: true,
            quizAttempt,
            message: score === 5 ? 'Congratulations! You passed the quiz!' : 'Keep trying! You need all correct answers to pass.'
        });

    } catch (error) {
        console.error('Error in submitQuizAttempt: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit quiz attempt',
            error: error.message
        });
    }
};

// Get quiz for a course
exports.getQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;

        const quiz = await Quiz.findOne({ course: courseId });
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found for this course'
            });
        }

        res.status(200).json({
            success: true,
            quiz
        });

    } catch (error) {
        console.error('Error in getQuiz: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quiz',
            error: error.message
        });
    }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
    try {
        const { courseId, questions } = req.body;

        // Validate questions
        if (!questions || !Array.isArray(questions) || questions.length !== 5) {
            return res.status(400).json({
                success: false,
                message: 'Exactly 5 questions are required'
            });
        }

        // Validate each question
        for (const question of questions) {
            if (!question.questionText || !question.options || 
                !Array.isArray(question.options) || 
                question.options.length !== 4 || 
                typeof question.correctOption !== 'number' || 
                question.correctOption < 0 || 
                question.correctOption > 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid question format'
                });
            }
        }

        const quiz = await Quiz.findOneAndUpdate(
            { course: courseId },
            { 
                questions,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found for this course'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Quiz updated successfully',
            quiz
        });

    } catch (error) {
        console.error('Error in updateQuiz: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update quiz',
            error: error.message
        });
    }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;

        const quiz = await Quiz.findOneAndDelete({ course: courseId });
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found for this course'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteQuiz: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete quiz',
            error: error.message
        });
    }
};