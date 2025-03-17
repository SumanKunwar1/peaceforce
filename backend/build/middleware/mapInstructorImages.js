"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInstructorImages = void 0;
const HttpMessage_1 = require("@src/utils/HttpMessage");
const mapInstructorImages = (req, res, next) => {
    try {
        const files = req.files; // Type assertion
        if (req.body.courses && files["instructorImage"]) {
            const courses = req.body.courses; // This is now an array
            const instructorImages = files["instructorImage"]; // Array of uploaded instructor images
            courses.forEach((course, index) => {
                if (course.instructor && instructorImages[index]) {
                    course.instructor.image = instructorImages[index].filename; // Assign image to corresponding instructor
                }
            });
            req.body.courses = courses; // Update request body
        }
        next();
    }
    catch (error) {
        console.log(error);
        next(HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR);
    }
};
exports.mapInstructorImages = mapInstructorImages;
