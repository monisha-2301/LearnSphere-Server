const Certificate = require('../models/certificate')
const CourseProgress = require('../models/courseProgress')
const Course = require('../models/course')
const User = require('../models/user')
const QuizAttempt = require('../models/quizAttempt')
const { v4: uuidv4 } = require('uuid')
const { generateCertificatePDF } = require('../utils/certificateGenerator')

// Generate certificate when course is completed
exports.generateCertificate = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id

        // Check if course exists
        const course = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            })
        }

        // Calculate total subsections
        let totalSubsections = 0
        course.courseContent.forEach(section => {
            totalSubsections += section.subSection.length
        })

        // Get course progress
        const courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId
        })

        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: 'Course progress not found'
            })
        }

        // Check if all videos are completed
        const completedVideos = courseProgress.completedVideos.length
        if (completedVideos < totalSubsections) {
            return res.status(400).json({
                success: false,
                message: 'Complete all videos to get certificate'
            })
        }

        // Check if quiz is passed
        const quizAttempt = await QuizAttempt.findOne({
            course: courseId,
            user: userId
        }).sort({ attemptDate: -1 })

        if (!quizAttempt) {
            return res.status(400).json({
                success: false,
                message: 'You must attempt the quiz before requesting a certificate'
            })
        }

        if (!quizAttempt.passed) {
            return res.status(400).json({
                success: false,
                message: 'You must pass the quiz with all correct answers to get the certificate. Your current score: ' + quizAttempt.score + '/5'
            })
        }

        // Check if certificate already exists
        let certificate = await Certificate.findOne({
            courseId,
            userId
        })

        if (certificate) {
            return res.status(200).json({
                success: true,
                certificate
            })
        }

        // Generate new certificate
        certificate = await Certificate.create({
            courseId,
            userId,
            certificateId: uuidv4(),
            completionStatus: true
        })

        // Get user and course details for certificate
        const user = await User.findById(userId)
        const certificateData = {
            userName: `${user.firstName} ${user.lastName}`,
            courseName: course.courseName,
            certificateId: certificate.certificateId,
            issueDate: certificate.issueDate.toLocaleDateString()
        }

        // Generate PDF certificate
        const pdfBuffer = await generateCertificatePDF(certificateData)

        return res.status(200).json({
            success: true,
            message: 'Certificate generated successfully',
            certificate,
            pdfBuffer: pdfBuffer.toString('base64')
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to generate certificate',
            error: error.message
        })
    }
}

// Verify certificate
exports.verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params

        const certificate = await Certificate.findOne({ certificateId })
            .populate('userId', 'firstName lastName')
            .populate('courseId', 'courseName')

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            })
        }

        // Generate PDF for verification
        const certificateData = {
            userName: `${certificate.userId.firstName} ${certificate.userId.lastName}`,
            courseName: certificate.courseId.courseName,
            certificateId: certificate.certificateId,
            issueDate: certificate.issueDate.toLocaleDateString()
        }

        const pdfBuffer = await generateCertificatePDF(certificateData)

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificateId}.pdf`)
        return res.send(pdfBuffer)
ion
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to verify certificate',
            error: error.message
        })
    }
}