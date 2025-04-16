const mongoose = require("mongoose")
const Section = require("../models/section")
const SubSection = require("../models/subSection")
const CourseProgress = require("../models/courseProgress")


// ================ update Course Progress ================
exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [subsectionId]
      })
      return res.status(200).json({
        success: true,
        message: "Course progress created successfully"
      })
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideos array
      courseProgress.completedVideos.push(subsectionId)
    }

    // Save the updated course progress
    await courseProgress.save()

    return res.status(200).json({ message: "Course progress updated" })
  }
  catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}



// ================ get Progress Percentage ================
exports.getProgressPercentage = async (req, res) => {
  const { courseId } = req.body
  const userId = req.user.id

  if (!courseId) {
    return res.status(400).json({ error: "Course ID not provided." })
  }

  try {
    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })
      .populate({
        path: "courseID",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection"
          }
        },
      })
      .exec()

    if (!courseProgress) {
      return res
        .status(404)
        .json({ error: "Course progress not found" })
    }

    let totalSubsections = 0
    courseProgress.courseID.courseContent.forEach((section) => {
      totalSubsections += section.subSection.length
    })

    if (totalSubsections === 0) {
      return res.status(400).json({ error: "No subsections found in the course" })
    }

    const completedVideos = courseProgress.completedVideos.length
    const progressPercentage = (completedVideos / totalSubsections) * 100

    // Round to 2 decimal places
    const roundedPercentage = Math.round(progressPercentage * 100) / 100

    return res.status(200).json({
      success: true,
      data: roundedPercentage,
      message: "Course progress fetched successfully"
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
