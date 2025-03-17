"use client";

import type React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import type { JobPosting } from "@/types/career";

const jobValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  department: Yup.string().required("Department is required"),
  location: Yup.string().required("Location is required"),
  type: Yup.string()
    .oneOf(["Full-time", "Part-time", "Contract"])
    .required("Job type is required"),
  description: Yup.string().required("Description is required"),
  requirements: Yup.string().required("Requirements are required"),
  responsibilities: Yup.string().required("Responsibilities are required"),
  benefits: Yup.string().required("Benefits are required"),
  deadline: Yup.string().required("Deadline is required"),
  metaTitle: Yup.string().required("Meta title is required"),
  metaDescription: Yup.string().required("Meta description is required"),
  metaKeywords: Yup.string().required("Meta keywords are required"),
});

type JobFormProps = {
  job?: JobPosting | null;
  onSubmit: (data: Partial<JobPosting>) => void;
  onCancel: () => void;
};

const JobForm: React.FC<JobFormProps> = ({ job, onSubmit, onCancel }) => {
  const formik = useFormik({
    initialValues: {
      title: job?.title || "",
      department: job?.department || "",
      location: job?.location || "",
      type: job?.type || "Full-time",
      description: job?.description || "",
      requirements: Array.isArray(job?.requirements)
        ? job.requirements.join("\n")
        : "",
      responsibilities: Array.isArray(job?.responsibilities)
        ? job.responsibilities.join("\n")
        : "",
      benefits: Array.isArray(job?.benefits) ? job.benefits.join("\n") : "",
      deadline: job?.deadline || "",
      metaTitle: job?.metaTitle || "",
      metaDescription: job?.metaDescription || "",
      metaKeywords: Array.isArray(job?.metaKeywords)
        ? job.metaKeywords.join(", ")
        : "",
    },
    validationSchema: jobValidationSchema,
    onSubmit: (values) => {
      const formattedData = {
        ...values,
        requirements: values.requirements
          .split("\n")
          .filter((item) => item.trim() !== ""),
        responsibilities: values.responsibilities
          .split("\n")
          .filter((item) => item.trim() !== ""),
        benefits: values.benefits
          .split("\n")
          .filter((item) => item.trim() !== ""),
        metaKeywords: values.metaKeywords
          .split(",")
          .map((keyword) => keyword.trim()),
      };
      onSubmit(formattedData);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-4 max-h-96 overflow-auto"
    >
      <Input
        {...formik.getFieldProps("title")}
        placeholder="Job Title"
        className={
          formik.errors.title && formik.touched.title ? "border-red-500" : ""
        }
      />
      {formik.errors.title && formik.touched.title && (
        <p className="text-red-500">{formik.errors.title}</p>
      )}

      <Input
        {...formik.getFieldProps("department")}
        placeholder="Department"
        className={
          formik.errors.department && formik.touched.department
            ? "border-red-500"
            : ""
        }
      />
      {formik.errors.department && formik.touched.department && (
        <p className="text-red-500">{formik.errors.department}</p>
      )}

      <Input
        {...formik.getFieldProps("location")}
        placeholder="Location"
        className={
          formik.errors.location && formik.touched.location
            ? "border-red-500"
            : ""
        }
      />
      {formik.errors.location && formik.touched.location && (
        <p className="text-red-500">{formik.errors.location}</p>
      )}

      <Select
        value={formik.values.type}
        onValueChange={(value) => formik.setFieldValue("type", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select job type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Full-time">Full-time</SelectItem>
          <SelectItem value="Part-time">Part-time</SelectItem>
          <SelectItem value="Contract">Contract</SelectItem>
        </SelectContent>
      </Select>
      {formik.errors.type && formik.touched.type && (
        <p className="text-red-500">{formik.errors.type}</p>
      )}

      <Textarea
        {...formik.getFieldProps("description")}
        placeholder="Job Description"
        className={
          formik.errors.description && formik.touched.description
            ? "border-red-500"
            : ""
        }
      />
      {formik.errors.description && formik.touched.description && (
        <p className="text-red-500">{formik.errors.description}</p>
      )}

      <Textarea
        {...formik.getFieldProps("requirements")}
        placeholder="Requirements (one per line)"
        className={
          formik.errors.requirements && formik.touched.requirements
            ? "border-red-500"
            : ""
        }
      />
      {formik.errors.requirements && formik.touched.requirements && (
        <p className="text-red-500">{formik.errors.requirements}</p>
      )}

      <Textarea
        {...formik.getFieldProps("responsibilities")}
        placeholder="Responsibilities (one per line)"
        className={
          formik.errors.responsibilities && formik.touched.responsibilities
            ? "border-red-500"
            : ""
        }
      />
      {formik.errors.responsibilities && formik.touched.responsibilities && (
        <p className="text-red-500">{formik.errors.responsibilities}</p>
      )}

      <Textarea
        {...formik.getFieldProps("benefits")}
        placeholder="Benefits (one per line)"
        className={
          formik.errors.benefits && formik.touched.benefits
            ? "border-red-500"
            : ""
        }
      />
      {formik.errors.benefits && formik.touched.benefits && (
        <p className="text-red-500">{formik.errors.benefits}</p>
      )}

      <Input
        {...formik.getFieldProps("deadline")}
        type="date"
        className={
          formik.errors.deadline && formik.touched.deadline
            ? "border-red-500"
            : ""
        }
      />
      {formik.errors.deadline && formik.touched.deadline && (
        <p className="text-red-500">{formik.errors.deadline}</p>
      )}

      <div className="rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          SEO Meta Information
        </h2>

        <div className="mb-4">
          <label
            htmlFor="metaTitle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Meta Title
          </label>
          <Input
            {...formik.getFieldProps("metaTitle")}
            id="metaTitle"
            name="metaTitle"
            className={
              formik.errors.metaTitle && formik.touched.metaTitle
                ? "border-red-500"
                : ""
            }
            placeholder="Enter meta title"
          />
          {formik.errors.metaTitle && formik.touched.metaTitle && (
            <p className="text-red-500">{formik.errors.metaTitle}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Meta Description
          </label>
          <Textarea
            {...formik.getFieldProps("metaDescription")}
            id="metaDescription"
            name="metaDescription"
            className={
              formik.errors.metaDescription && formik.touched.metaDescription
                ? "border-red-500"
                : ""
            }
            placeholder="Enter meta description"
          />
          {formik.errors.metaDescription && formik.touched.metaDescription && (
            <p className="text-red-500">{formik.errors.metaDescription}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="metaKeywords"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Meta Keywords
          </label>
          <Input
            {...formik.getFieldProps("metaKeywords")}
            id="metaKeywords"
            name="metaKeywords"
            className={
              formik.errors.metaKeywords && formik.touched.metaKeywords
                ? "border-red-500"
                : ""
            }
            placeholder="Enter keywords (comma-separated)"
          />
          {formik.errors.metaKeywords && formik.touched.metaKeywords && (
            <p className="text-red-500">{formik.errors.metaKeywords}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{job ? "Update Job" : "Add Job"}</Button>
      </div>
    </form>
  );
};

export default JobForm;
