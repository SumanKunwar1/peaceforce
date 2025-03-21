"use strict";
/**
 * If the image field exists and starts with "/api/image", we delete it from the body.
 * This logic applies only to PATCH requests, ensuring that the image replacement, removal,
 or no change at all works correctly. We handle this by removing the image field before
 validation, so that the correct image handling logic (replace, remove, or keep as is)
 can be applied properly without interference from previous image data.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.validatePageUpdate = exports.validatePage = exports.validateSeoMetaUpdate = exports.validateSeoMeta = exports.validateTestimonial = exports.validateStats = exports.validateBookMembershipUpdate = exports.validateBookMembership = exports.validateMembership = exports.validateInfoSection = exports.validateContact = exports.validateGalleryEventInsert = exports.validateGallery = exports.validateTeam = exports.validateDonation = exports.validateSupport = exports.validateFAQUpdate = exports.validateFAQ = exports.validateAbout = exports.validateSlider = exports.validateProgramBookingUpdate = exports.validateProgramBookingForm = exports.validateProgram = exports.validateEventBookingUpdate = exports.validateEventBookingForm = exports.validateEvent = exports.validateBookingUpdate = exports.validateBookingForm = exports.validateTour = exports.validateJobApplicator = exports.validateEnrollmentUpdate = exports.validateEnrollmentForm = exports.trackFilesForDeletion = exports.parseJsonFields = exports.mapInstructorImages = exports.appendFile = exports.isAuthenticated = exports.validateBlogPost = exports.validateCourseCategory = exports.validateJobPost = void 0;
const appendFile_1 = require("./appendFile");
Object.defineProperty(exports, "appendFile", { enumerable: true, get: function () { return appendFile_1.appendFile; } });
const mapInstructorImages_1 = require("./mapInstructorImages");
Object.defineProperty(exports, "mapInstructorImages", { enumerable: true, get: function () { return mapInstructorImages_1.mapInstructorImages; } });
const parseJsonFields_1 = require("./parseJsonFields");
Object.defineProperty(exports, "parseJsonFields", { enumerable: true, get: function () { return parseJsonFields_1.parseJsonFields; } });
const isAuthenticated_1 = require("./isAuthenticated");
Object.defineProperty(exports, "isAuthenticated", { enumerable: true, get: function () { return isAuthenticated_1.isAuthenticated; } });
const validateBlogPost_1 = require("./validateBlogPost");
Object.defineProperty(exports, "validateBlogPost", { enumerable: true, get: function () { return validateBlogPost_1.validateBlogPost; } });
const validateCourseCategory_1 = require("./validateCourseCategory");
Object.defineProperty(exports, "validateCourseCategory", { enumerable: true, get: function () { return validateCourseCategory_1.validateCourseCategory; } });
const validateJobPost_1 = require("./validateJobPost");
Object.defineProperty(exports, "validateJobPost", { enumerable: true, get: function () { return validateJobPost_1.validateJobPost; } });
const trackFileForDeletion_1 = require("./trackFileForDeletion");
Object.defineProperty(exports, "trackFilesForDeletion", { enumerable: true, get: function () { return trackFileForDeletion_1.trackFilesForDeletion; } });
const validateEnrollementForm_1 = require("./validateEnrollementForm");
Object.defineProperty(exports, "validateEnrollmentForm", { enumerable: true, get: function () { return validateEnrollementForm_1.validateEnrollmentForm; } });
const validateEnrollementUpdate_1 = require("./validateEnrollementUpdate");
Object.defineProperty(exports, "validateEnrollmentUpdate", { enumerable: true, get: function () { return validateEnrollementUpdate_1.validateEnrollmentUpdate; } });
const validateJobApplicator_1 = require("./validateJobApplicator");
Object.defineProperty(exports, "validateJobApplicator", { enumerable: true, get: function () { return validateJobApplicator_1.validateJobApplicator; } });
const validateTour_1 = require("./validateTour");
Object.defineProperty(exports, "validateTour", { enumerable: true, get: function () { return validateTour_1.validateTour; } });
const validateBookingForm_1 = require("./validateBookingForm");
Object.defineProperty(exports, "validateBookingForm", { enumerable: true, get: function () { return validateBookingForm_1.validateBookingForm; } });
const validateBookingUpdate_1 = require("./validateBookingUpdate");
Object.defineProperty(exports, "validateBookingUpdate", { enumerable: true, get: function () { return validateBookingUpdate_1.validateBookingUpdate; } });
const ValidateEvent_1 = require("./ValidateEvent");
Object.defineProperty(exports, "validateEvent", { enumerable: true, get: function () { return ValidateEvent_1.validateEvent; } });
const validateEventBookingForm_1 = require("./validateEventBookingForm");
Object.defineProperty(exports, "validateEventBookingForm", { enumerable: true, get: function () { return validateEventBookingForm_1.validateEventBookingForm; } });
const validateEventBookingUpdate_1 = require("./validateEventBookingUpdate");
Object.defineProperty(exports, "validateEventBookingUpdate", { enumerable: true, get: function () { return validateEventBookingUpdate_1.validateEventBookingUpdate; } });
const validateProgram_1 = require("./validateProgram");
Object.defineProperty(exports, "validateProgram", { enumerable: true, get: function () { return validateProgram_1.validateProgram; } });
const validateProgramBookingForm_1 = require("./validateProgramBookingForm");
Object.defineProperty(exports, "validateProgramBookingForm", { enumerable: true, get: function () { return validateProgramBookingForm_1.validateProgramBookingForm; } });
const validateProgramBookingUpdate_1 = require("./validateProgramBookingUpdate");
Object.defineProperty(exports, "validateProgramBookingUpdate", { enumerable: true, get: function () { return validateProgramBookingUpdate_1.validateProgramBookingUpdate; } });
const validateSlider_1 = require("./validateSlider");
Object.defineProperty(exports, "validateSlider", { enumerable: true, get: function () { return validateSlider_1.validateSlider; } });
const validateAbout_1 = require("./validateAbout");
Object.defineProperty(exports, "validateAbout", { enumerable: true, get: function () { return validateAbout_1.validateAbout; } });
const validateFaq_1 = require("./validateFaq");
Object.defineProperty(exports, "validateFAQ", { enumerable: true, get: function () { return validateFaq_1.validateFAQ; } });
const validateFaqUpdate_1 = require("./validateFaqUpdate");
Object.defineProperty(exports, "validateFAQUpdate", { enumerable: true, get: function () { return validateFaqUpdate_1.validateFAQUpdate; } });
const validateSupport_1 = require("./validateSupport");
Object.defineProperty(exports, "validateSupport", { enumerable: true, get: function () { return validateSupport_1.validateSupport; } });
const validateDonation_1 = require("./validateDonation");
Object.defineProperty(exports, "validateDonation", { enumerable: true, get: function () { return validateDonation_1.validateDonation; } });
const validateTeam_1 = require("./validateTeam");
Object.defineProperty(exports, "validateTeam", { enumerable: true, get: function () { return validateTeam_1.validateTeam; } });
const validateGallery_1 = require("./validateGallery");
Object.defineProperty(exports, "validateGallery", { enumerable: true, get: function () { return validateGallery_1.validateGallery; } });
const validateGalleryEventInsert_1 = require("./validateGalleryEventInsert");
Object.defineProperty(exports, "validateGalleryEventInsert", { enumerable: true, get: function () { return validateGalleryEventInsert_1.validateGalleryEventInsert; } });
const validateContact_1 = require("./validateContact");
Object.defineProperty(exports, "validateContact", { enumerable: true, get: function () { return validateContact_1.validateContact; } });
const validateInfoSection_1 = require("./validateInfoSection");
Object.defineProperty(exports, "validateInfoSection", { enumerable: true, get: function () { return validateInfoSection_1.validateInfoSection; } });
const validateMemberShip_1 = require("./validateMemberShip");
Object.defineProperty(exports, "validateMembership", { enumerable: true, get: function () { return validateMemberShip_1.validateMembership; } });
const validateBookMembership_1 = require("./validateBookMembership");
Object.defineProperty(exports, "validateBookMembership", { enumerable: true, get: function () { return validateBookMembership_1.validateBookMembership; } });
const validateBookMembershipUpdate_1 = require("./validateBookMembershipUpdate");
Object.defineProperty(exports, "validateBookMembershipUpdate", { enumerable: true, get: function () { return validateBookMembershipUpdate_1.validateBookMembershipUpdate; } });
const validateStats_1 = require("./validateStats");
Object.defineProperty(exports, "validateStats", { enumerable: true, get: function () { return validateStats_1.validateStats; } });
const validateTestimonials_1 = require("./validateTestimonials");
Object.defineProperty(exports, "validateTestimonial", { enumerable: true, get: function () { return validateTestimonials_1.validateTestimonial; } });
const validateSeoMeta_1 = require("./validateSeoMeta");
Object.defineProperty(exports, "validateSeoMeta", { enumerable: true, get: function () { return validateSeoMeta_1.validateSeoMeta; } });
const validateSeoMetaUpdate_1 = require("./validateSeoMetaUpdate");
Object.defineProperty(exports, "validateSeoMetaUpdate", { enumerable: true, get: function () { return validateSeoMetaUpdate_1.validateSeoMetaUpdate; } });
const validatePage_1 = require("./validatePage");
Object.defineProperty(exports, "validatePage", { enumerable: true, get: function () { return validatePage_1.validatePage; } });
const validatePageUpdate_1 = require("./validatePageUpdate");
Object.defineProperty(exports, "validatePageUpdate", { enumerable: true, get: function () { return validatePageUpdate_1.validatePageUpdate; } });
const validateUser_1 = require("./validateUser");
Object.defineProperty(exports, "validateUser", { enumerable: true, get: function () { return validateUser_1.validateUser; } });
