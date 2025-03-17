"use client";

import type React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitJobApplication } from "@/lib/api";
import type { JobPosting } from "@/types/career";
import { useToast } from "@/hooks/use-toast";

type CareerFormProps = {
  selectedJob: JobPosting | null;
  isOpen: boolean;
  onClose: () => void;
};

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
  cv: Yup.mixed().required("CV is required"),
  coverLetter: Yup.mixed(),
});

const CareerForm: React.FC<CareerFormProps> = ({
  selectedJob,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast(); // Moved useToast call outside the conditional
  if (!selectedJob) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for {selectedJob.title}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phoneNumber: "",
            page: "/career",
            pageTitle: selectedJob.title,
            cv: null as File | null,
            coverLetter: null as File | null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const formData = new FormData();
              formData.append("name", values.name);
              formData.append("email", values.email);
              formData.append("phoneNumber", values.phoneNumber);
              formData.append("page", values.page);
              formData.append("pageTitle", values.pageTitle);
              if (values.cv) formData.append("cv", values.cv);
              if (values.coverLetter)
                formData.append("coverLetter", values.coverLetter);
              formData.append("jobPostId", selectedJob.id as string);

              const response = await submitJobApplication(formData);

              if (response.success) {
                toast({
                  title: "Success",
                  description:
                    response.message || "Application submitted successfully!",
                  variant: "default",
                });
                resetForm();
                onClose();
              } else {
                // Handle successful submission with warnings
                toast({
                  title: "Application Submitted",
                  description:
                    response.message ||
                    "Application submitted with some concerns.",
                });
              }
            } catch (error: any) {
              console.error("Error submitting application:", error);

              const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to submit application. Please try again.";

              toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Field name="name" as={Input} id="name" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Field name="email" type="email" as={Input} id="email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Contact Number</Label>
                <Field name="phoneNumber" as={Input} id="phoneNumber" />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cv">Upload CV</Label>
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("cv", event.currentTarget.files?.[0])
                  }
                />
                <ErrorMessage
                  name="cv"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="coverLetter">
                  Upload Cover Letter (Optional)
                </Label>
                <Input
                  id="coverLetter"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("coverLetter", event.currentTarget.files?.[0])
                  }
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CareerForm;
