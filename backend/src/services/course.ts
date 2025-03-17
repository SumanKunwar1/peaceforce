import { ICourseInput } from "@src/types";
import { Course, ICourse, EnrollmentForm } from "@models";
import { deleteFile } from "@utils/deleteFile";
import { httpMessages } from "@utils/HttpMessage";
import { enrollmentService } from "@services";

class CourseCategoryService {
  // Create a new course category
  async createCourseCategory(
    courseCategoryData: ICourseInput
  ): Promise<ICourse> {
    try {
      // Directly create new category without saving images
      const newCourseCategory = new Course({
        ...courseCategoryData,
      });

      await newCourseCategory.save();
      return newCourseCategory;
    } catch (error) {
      console.error("Error creating course category:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Get all course categories
  async getCourseCategories(): Promise<ICourse[]> {
    try {
      const courses = await Course.find();

      return courses.map((course) => {
        const courseObj = course.toObject();
        return {
          ...courseObj,
          image: courseObj.image
            ? `/api/image/${courseObj.image}`
            : courseObj.image,
          instructor: {
            ...courseObj.instructor,
            image: courseObj.instructor?.image
              ? `/api/image/${courseObj.instructor.image}`
              : courseObj.instructor.image,
          },
        } as ICourse;
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getCourseById(id: string): Promise<ICourse | null> {
    try {
      const course = await Course.findById(id);
      if (!course) {
        throw httpMessages.USER_NOT_FOUND("Course");
      }

      const courseObj = course.toObject();
      return {
        ...courseObj,
        image: courseObj.image
          ? `/api/image/${courseObj.image}`
          : courseObj.image,
        instructor: {
          ...courseObj.instructor,
          image: courseObj.instructor?.image
            ? `/api/image/${courseObj.instructor.image}`
            : courseObj.instructor.image,
        },
      } as ICourse;
    } catch (error) {
      console.error("Error fetching course by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Update an existing course category
  //todo: check the way the data is sent from teh frontend for the update for courses and update the logic for the course updates opr replacement and enrollement form deletion
  async updateCourseCategory(
    id: string,
    courseData: ICourseInput
  ): Promise<ICourse | null> {
    try {
      const existingCourse = await Course.findById(id);
      if (!existingCourse) {
        throw httpMessages.USER_NOT_FOUND("Course");
      }

      if (courseData.image !== undefined) {
        if (courseData.image === "" && existingCourse.image) {
          await deleteFile(existingCourse.image);
          courseData.image = "";
        } else if (!courseData.image.startsWith("/api/image/")) {
          if (existingCourse.image) {
            await deleteFile(existingCourse.image);
          }
        }
      }

      if (courseData.instructor?.image !== undefined) {
        if (
          courseData.instructor.image === "" &&
          existingCourse.instructor.image
        ) {
          await deleteFile(existingCourse.instructor.image);
          courseData.instructor.image = "";
        } else if (!courseData.instructor.image.startsWith("/api/image/")) {
          if (existingCourse.instructor.image) {
            await deleteFile(existingCourse.instructor.image);
          }
        }
      }

      const updatedCourse = await Course.findByIdAndUpdate(id, courseData, {
        new: true,
      });
      if (!updatedCourse) {
        throw httpMessages.USER_NOT_FOUND("Course");
      }

      return updatedCourse;
    } catch (error) {
      console.error("Error updating course:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Delete a course category
  async deleteCourseCategory(id: string): Promise<string> {
    try {
      const courseToDelete = await Course.findById(id);

      if (!courseToDelete) {
        throw httpMessages.USER_NOT_FOUND("Course category");
      }

      if (courseToDelete.image) {
        await deleteFile(courseToDelete.image);
      }

      if (courseToDelete.instructor?.image) {
        await deleteFile(courseToDelete.instructor.image);
      }

      // Delete the course category
      await Course.findByIdAndDelete(id);

      const enrollments = await EnrollmentForm.find({
        courseId: { $in: courseToDelete._id },
      });

      for (const enrollment of enrollments) {
        await enrollmentService.deleteEnrollment(enrollment._id.toString());
      }

      return `Course category with ID ${id} has been deleted`;
    } catch (error) {
      console.error("Error deleting course category:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const courseCategoryService = new CourseCategoryService();
