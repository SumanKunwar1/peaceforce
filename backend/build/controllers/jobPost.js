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
exports.JobPostController = void 0;
const _services_1 = require("@services");
class JobPostController {
    static createJobPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobData = req.body;
                const jobPost = yield _services_1.jobPostService.createJobPost(jobData);
                res.locals.responseData = jobPost;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getJobPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobPosts = yield _services_1.jobPostService.getJobPosts();
                res.locals.responseData = { jobPosts };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getJobPostById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobPostId } = req.params;
                const jobPost = yield _services_1.jobPostService.getJobPostById(jobPostId);
                res.locals.responseData = { jobPost };
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateJobPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobPostId } = req.params;
                const jobData = req.body;
                const updatedJobPost = yield _services_1.jobPostService.updateJobPost(jobPostId, jobData);
                res.locals.responseData = updatedJobPost;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteJobPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobPostId } = req.params;
                const deletedJobPost = yield _services_1.jobPostService.deleteJobPost(jobPostId);
                res.locals.responseData = deletedJobPost;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.JobPostController = JobPostController;
