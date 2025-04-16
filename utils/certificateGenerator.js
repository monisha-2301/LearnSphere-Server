const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateCertificatePDF = async (certificateData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4'
            });

            // Stream to store PDF
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Certificate styling
            doc.font('Helvetica-Bold')
                .fontSize(30)
                .text('LearnSphere', 150, 60, { align: 'center' })
                .fontSize(50)
                .text('Certificate of Completion', 150, 120, { align: 'center' });

            // Course name
            doc.fontSize(25)
                .text('This is to certify that', 150, 180, { align: 'center' })
                .fontSize(30)
                .text(certificateData.userName, 150, 240, { align: 'center' })
                .fontSize(25)
                .text('has successfully completed the course', 150, 300, { align: 'center' })
                .fontSize(30)
                .text(certificateData.courseName, 150, 360, { align: 'center' });

            // Certificate ID and date
            doc.fontSize(12)
                .text(`Certificate ID: ${certificateData.certificateId}`, 150, 440, { align: 'center' })
                .text(`Issue Date: ${certificateData.issueDate}`, 150, 460, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateCertificatePDF };