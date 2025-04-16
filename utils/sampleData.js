// Sample data for testing course enrollment functionality

const sampleCategories = [
  {
    _id: "cat1",
    name: "Web Development",
    description: "Learn web development from scratch"
  },
  {
    _id: "cat2",
    name: "Mobile Development",
    description: "Master mobile app development"
  }
];

const sampleUsers = [
  {
    _id: "user1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "hashedPassword123",
    accountType: "Student",
    active: true,
    approved: true,
    image: "https://example.com/john.jpg",
    courses: [],
    courseProgress: []
  },
  {
    _id: "user2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "hashedPassword456",
    accountType: "Instructor",
    active: true,
    approved: true,
    image: "https://example.com/jane.jpg",
    courses: []
  }
];

const sampleCourses = [
  {
    _id: "course1",
    courseName: "Complete Web Development Bootcamp",
    courseDescription: "Learn HTML, CSS, JavaScript, React and Node.js",
    instructor: "user2",
    whatYouWillLearn: "Build full-stack web applications",
    courseContent: ["section1", "section2"],
    thumbnail: "https://example.com/webdev.jpg",
    category: "cat1",
    tag: ["web", "javascript", "react"],
    studentsEnrolled: [],
    instructions: ["Complete all assignments", "Watch all videos"],
    status: "Published"
  },
  {
    _id: "course2",
    courseName: "iOS App Development",
    courseDescription: "Master iOS development with Swift",
    instructor: "user2",
    whatYouWillLearn: "Build iOS applications from scratch",
    courseContent: ["section3"],
    thumbnail: "https://example.com/ios.jpg",
    category: "cat2",
    tag: ["ios", "swift", "mobile"],
    studentsEnrolled: [],
    instructions: ["Practice coding daily", "Complete projects"],
    status: "Published"
  }
];

const sampleSections = [
  {
    _id: "section1",
    sectionName: "HTML & CSS Basics",
    subSection: ["subsection1", "subsection2"]
  },
  {
    _id: "section2",
    sectionName: "JavaScript Fundamentals",
    subSection: ["subsection3"]
  },
  {
    _id: "section3",
    sectionName: "Swift Basics",
    subSection: ["subsection4", "subsection5"]
  }
];

const sampleSubSections = [
  {
    _id: "subsection1",
    title: "Introduction to HTML",
    timeDuration: "30:00",
    description: "Learn HTML basics",
    videoUrl: "https://example.com/html-intro.mp4"
  },
  {
    _id: "subsection2",
    title: "CSS Styling",
    timeDuration: "45:00",
    description: "Master CSS styling techniques",
    videoUrl: "https://example.com/css-styling.mp4"
  },
  {
    _id: "subsection3",
    title: "JavaScript Basics",
    timeDuration: "60:00",
    description: "Learn JavaScript fundamentals",
    videoUrl: "https://example.com/js-basics.mp4"
  },
  {
    _id: "subsection4",
    title: "Swift Introduction",
    timeDuration: "40:00",
    description: "Introduction to Swift programming",
    videoUrl: "https://example.com/swift-intro.mp4"
  },
  {
    _id: "subsection5",
    title: "iOS UI Components",
    timeDuration: "50:00",
    description: "Working with iOS UI components",
    videoUrl: "https://example.com/ios-ui.mp4"
  }
];

module.exports = {
  sampleCategories,
  sampleUsers,
  sampleCourses,
  sampleSections,
  sampleSubSections
};