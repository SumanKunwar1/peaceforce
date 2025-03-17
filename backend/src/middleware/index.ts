/** 
 * If the image field exists and starts with "/api/image", we delete it from the body.
 * This logic applies only to PATCH requests, ensuring that the image replacement, removal,
 or no change at all works correctly. We handle this by removing the image field before
 validation, so that the correct image handling logic (replace, remove, or keep as is)
 can be applied properly without interference from previous image data.
*/

import { appendFile } from "./appendFile";
import { mapInstructorImages } from "./mapInstructorImages";
import { parseJsonFields } from "./parseJsonFields";
import { isAuthenticated } from "./isAuthenticated";
import { validateBlogPost } from "./validateBlogPost";
import { validateCourseCategory } from "./validateCourseCategory";
import { validateJobPost } from "./validateJobPost";
import { trackFilesForDeletion } from "./trackFileForDeletion";
import { validateEnrollmentForm } from "./validateEnrollementForm";
import { validateEnrollmentUpdate } from "./validateEnrollementUpdate";
import { validateJobApplicator } from "./validateJobApplicator";
import { validateTour } from "./validateTour";
import { validateBookingForm } from "./validateBookingForm";
import { validateBookingUpdate } from "./validateBookingUpdate";
import { validateEvent } from "./ValidateEvent";
import { validateEventBookingForm } from "./validateEventBookingForm";
import { validateEventBookingUpdate } from "./validateEventBookingUpdate";
import { validateProgram } from "./validateProgram";
import { validateProgramBookingForm } from "./validateProgramBookingForm";
import { validateProgramBookingUpdate } from "./validateProgramBookingUpdate";
import { validateSlider } from "./validateSlider";
import { validateAbout } from "./validateAbout";
import { validateFAQ } from "./validateFaq";
import { validateFAQUpdate } from "./validateFaqUpdate";
import { validateSupport } from "./validateSupport";
import { validateDonation } from "./validateDonation";
import { validateTeam } from "./validateTeam";
import { validateGallery } from "./validateGallery";
import { validateGalleryEventInsert } from "./validateGalleryEventInsert";
import { validateContact } from "./validateContact";
import { validateInfoSection } from "./validateInfoSection";
import { validateMembership } from "./validateMemberShip";
import { validateBookMembership } from "./validateBookMembership";
import { validateBookMembershipUpdate } from "./validateBookMembershipUpdate";
import { validateStats } from "./validateStats";
import { validateTestimonial } from "./validateTestimonials";
import { validateSeoMeta } from "./validateSeoMeta";
import { validateSeoMetaUpdate } from "./validateSeoMetaUpdate";
import { validatePage } from "./validatePage";
import { validatePageUpdate } from "./validatePageUpdate";
import { validateUser } from "./validateUser";

export {
  validateJobPost,
  validateCourseCategory,
  validateBlogPost,
  isAuthenticated,
  appendFile,
  mapInstructorImages,
  parseJsonFields,
  trackFilesForDeletion,
  validateEnrollmentForm,
  validateEnrollmentUpdate,
  validateJobApplicator,
  validateTour,
  validateBookingForm,
  validateBookingUpdate,
  validateEvent,
  validateEventBookingForm,
  validateEventBookingUpdate,
  validateProgram,
  validateProgramBookingForm,
  validateProgramBookingUpdate,
  validateSlider,
  validateAbout,
  validateFAQ,
  validateFAQUpdate,
  validateSupport,
  validateDonation,
  validateTeam,
  validateGallery,
  validateGalleryEventInsert,
  validateContact,
  validateInfoSection,
  validateMembership,
  validateBookMembership,
  validateBookMembershipUpdate,
  validateStats,
  validateTestimonial,
  validateSeoMeta,
  validateSeoMetaUpdate,
  validatePage,
  validatePageUpdate,
  validateUser,
};
