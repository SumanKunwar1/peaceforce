"use client";

import type React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EnrollmentFormData } from "@/types/course";
import { createEnrollment } from "@/lib/enrollment";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/shared/Spinner";

interface EnrollmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EnrollmentFormData) => void;
  courseTitle: string;
  courseId: string;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courseTitle,
  courseId,
}) => {
  const { toast } = useToast();
  const location = useLocation();
  const page = location.pathname;

  const validationSchema = Yup.object({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must be numeric")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    preferredLanguage: Yup.string().required("Preferred Language is required"),
    message: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      preferredLanguage: "English",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const enrollmentData: EnrollmentFormData = {
        ...values,
        page,
        pageTitle: courseTitle,
        courseId: courseId,
      };

      try {
        await createEnrollment(enrollmentData);
        console.log("enrollment data", enrollmentData);
        onSubmit(enrollmentData);
        toast({
          title: "Enrollment Successful",
          description: "You have successfully enrolled in the course.",
          duration: 4000,
        });
        resetForm();
        onClose();
      } catch (error) {
        console.error("Enrollment Error:", error);
        toast({
          title: "Enrollment Failed",
          description: "There was an error submitting your enrollment.",
          duration: 4000,
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Enroll in Course</DialogTitle>
          <DialogDescription>{courseTitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-green-600 text-sm">{formik.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-green-600 text-sm">{formik.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phoneNumber"
              className="text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="text-green-600 text-sm">
                {formik.errors.phoneNumber}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <Textarea
              id="address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-green-600 text-sm">{formik.errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="preferredLanguage"
              className="text-sm font-medium text-gray-700"
            >
              Preferred Language
            </label>
            <Select
              value={formik.values.preferredLanguage}
              onValueChange={(value) =>
                formik.setFieldValue("preferredLanguage", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Nepali">Nepali</SelectItem>
                <SelectItem value="Tibetan">Tibetan</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.preferredLanguage &&
              formik.errors.preferredLanguage && (
                <p className="text-green-600 text-sm">
                  {formik.errors.preferredLanguage}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700"
            >
              Message (Optional)
            </label>
            <Textarea
              id="message"
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-700"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <>
                <Spinner /> Submitting...
              </>
            ) : (
              "Submit Enrollment"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentForm;
