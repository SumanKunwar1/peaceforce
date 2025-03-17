"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobPostService = void 0;
const _models_1 = require("@models");
const HttpMessage_1 = require("@utils/HttpMessage");
class JobPostService {
    createJobPost(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newJobPost = new _models_1.JobPost(jobData);
                yield newJobPost.save();
                return newJobPost;
            }
            catch (error) {
                console.error("Error creating job post:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Get all job posts
    getJobPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield _models_1.JobPost.find();
            }
            catch (error) {
                console.error("Error fetching job posts:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Get a job post by ID
    getJobPostById(jobPostId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobPost = yield _models_1.JobPost.findById(jobPostId);
                if (!jobPost) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Job post");
                }
                return jobPost;
            }
            catch (error) {
                console.error("Error fetching job post by ID:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Update a job post
    updateJobPost(jobPostId, jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedJobPost = yield _models_1.JobPost.findByIdAndUpdate(jobPostId, jobData, { new: true });
                if (!updatedJobPost) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Job post");
                }
                return updatedJobPost;
            }
            catch (error) {
                console.error("Error updating job post:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
    // Delete a job post
    deleteJobPost(jobPostId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedJobPost = yield _models_1.JobPost.findByIdAndDelete(jobPostId);
                if (!deletedJobPost) {
                    throw HttpMessage_1.httpMessages.USER_NOT_FOUND("Job post");
                }
                return deletedJobPost;
            }
            catch (error) {
                console.error("Error deleting job post:", error);
                throw HttpMessage_1.httpMessages.INTERNAL_SERVER_ERROR;
            }
        });
    }
}
// Export an instance of JobPostService
exports.jobPostService = new JobPostService();
