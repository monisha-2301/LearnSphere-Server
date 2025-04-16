const express = require('express')
const router = express.Router()
const { auth, isStudent } = require('../middleware/auth')
const { generateCertificate, verifyCertificate } = require('../controllers/certificate')

// Generate certificate route
router.post('/generate', auth, isStudent, generateCertificate)

// Verify certificate route
router.get('/verify/:certificateId', verifyCertificate)

module.exports = router