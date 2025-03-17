import { IJobPost, JobPost } from "@models";
import { IJobPostInput } from "@typeInterface";
import { httpMessages } from "@utils/HttpMessage";
import { userService } from "@services";

class JobPostService {
  async createJobPost(jobData: IJobPostInput): Promise<IJobPost> {
    try {
      const newJobPost = new JobPost(jobData);
      await newJobPost.save();
      return newJobPost;
    } catch (error) {
      console.error("Error creating job post:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Get all job posts
  async getJobPosts(): Promise<IJobPost[]> {
    try {
      return await JobPost.find();
    } catch (error) {
      console.error("Error fetching job posts:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Get a job post by ID
  async getJobPostById(jobPostId: string): Promise<IJobPost | null> {
    try {
      const jobPost = await JobPost.findById(jobPostId);
      if (!jobPost) {
        throw httpMessages.USER_NOT_FOUND("Job post");
      }
      return jobPost;
    } catch (error) {
      console.error("Error fetching job post by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Update a job post
  async updateJobPost(
    jobPostId: string,
    jobData: IJobPostInput
  ): Promise<IJobPost | null> {
    try {
      const updatedJobPost = await JobPost.findByIdAndUpdate(
        jobPostId,
        jobData,
        { new: true }
      );

      if (!updatedJobPost) {
        throw httpMessages.USER_NOT_FOUND("Job post");
      }

      return updatedJobPost;
    } catch (error) {
      console.error("Error updating job post:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  // Delete a job post
  async deleteJobPost(jobPostId: string): Promise<IJobPost | null> {
    try {
      const deletedJobPost = await JobPost.findByIdAndDelete(jobPostId);
      if (!deletedJobPost) {
        throw httpMessages.USER_NOT_FOUND("Job post");
      }
      return deletedJobPost;
    } catch (error) {
      console.error("Error deleting job post:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

// Export an instance of JobPostService
export const jobPostService = new JobPostService();
