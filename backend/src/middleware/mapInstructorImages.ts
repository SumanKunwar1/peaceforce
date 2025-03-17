import { httpMessages } from "../utils/HttpMessage";
import { Request, Response, NextFunction } from "express";

export const mapInstructorImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [key: string]: Express.Multer.File[] }; // Type assertion
    if (req.body.courses && files["instructorImage"]) {
      const courses = req.body.courses; // This is now an array
      const instructorImages = files["instructorImage"]; // Array of uploaded instructor images

      courses.forEach((course: any, index: any) => {
        if (course.instructor && instructorImages[index]) {
          course.instructor.image = instructorImages[index].filename; // Assign image to corresponding instructor
        }
      });

      req.body.courses = courses; // Update request body
    }
    next();
  } catch (error) {
    console.log(error);
    next(httpMessages.INTERNAL_SERVER_ERROR);
  }
};
