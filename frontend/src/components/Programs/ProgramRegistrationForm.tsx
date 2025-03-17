import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProgramRegistrationData } from "@/types/program";
import Spinner from "../shared/Spinner";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  page: Yup.string().required("Page is required"),
  pageTitle: Yup.string().required("Page Title is required"),
  participants: Yup.number()
    .min(1, "At least one participant is required")
    .required("Number of participants is required"),
  specialRequirements: Yup.string().optional(),
});

interface ProgramRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProgramRegistrationData) => void;
  programTitle: string;
  programId: string;
}

const ProgramRegistrationForm: React.FC<ProgramRegistrationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  programTitle,
  programId,
}) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      page: window.location.pathname,
      pageTitle: programTitle,
      programId: programId,
      participants: 1,
      specialRequirements: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Register for Program</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-sm text-red-600">{formik.errors.name}</div>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-sm text-red-600">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1"
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-sm text-red-600">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="participants" className="block text-sm font-medium">
              Number of Participants
            </label>
            <Input
              id="participants"
              name="participants"
              type="number"
              min="1"
              value={formik.values.participants}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1"
            />
            {formik.touched.participants && formik.errors.participants && (
              <div className="text-sm text-red-600">
                {formik.errors.participants}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="specialRequirements"
              className="block text-sm font-medium"
            >
              Special Requirements (Optional)
            </label>
            <Textarea
              id="specialRequirements"
              name="specialRequirements"
              value={formik.values.specialRequirements}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1"
            />
            {formik.touched.specialRequirements &&
              formik.errors.specialRequirements && (
                <div className="text-sm text-red-600">
                  {formik.errors.specialRequirements}
                </div>
              )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-red-600 text-white hover:bg-red-700 w-full"
            >
              {formik.isSubmitting
                ? `${(<Spinner />)} Submitting...`
                : "Submit Resigtration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramRegistrationForm;
