"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Mail, Trash2 } from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getInfoSection,
  createInfoSection,
  updateInfoSection,
  deleteInfoSection,
} from "@/lib/infoSection";
import {
  getSeoMeta,
  createSeoMeta,
  updateSeoMeta,
  deleteSeoMeta,
} from "@/lib/seoMetaApi";
import type { IInfoSectionData, IInfoSectionInput } from "@/types/infoSection";
import type { ISeoMeta, ISeoMetaInput } from "@/types/seoMeta";
import Loader from "@/components/Loader";

const validationSchema = Yup.object().shape({
  location: Yup.string(),
  phoneNumber: Yup.string().matches(
    /^\+?[1-9]\d{1,14}$/,
    "Invalid phone number"
  ),
  email: Yup.string().email("Invalid email"),
  socialLinks: Yup.object().shape({
    instagram: Yup.string().url("Invalid URL"),
    facebook: Yup.string().url("Invalid URL"),
    twitter: Yup.string().url("Invalid URL"),
    linkedin: Yup.string().url("Invalid URL"),
    youtube: Yup.string().url("Invalid URL"),
  }),
  pageTitle: Yup.string().required("Page Title is required"),
  metaTitle: Yup.string(),
  metaDescription: Yup.string(),
  metaKeywords: Yup.array().of(Yup.string()),
  canonicalUrl: Yup.string().url("Invalid URL"),
  robotsMeta: Yup.string(),
  ogTitle: Yup.string(),
  ogDescription: Yup.string(),
  ogImage: Yup.string().url("Invalid URL"),
});

const Settings: React.FC = () => {
  const [infoSection, setInfoSection] = useState<IInfoSectionData | null>(null);
  const [seoMeta, setSeoMeta] = useState<ISeoMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [infoData, seoData] = await Promise.all([
        getInfoSection(),
        getSeoMeta(),
      ]);
      setInfoSection(infoData.infoSection);
      Array.isArray(seoData.seoMeta) ? setSeoMeta(seoData.seoMeta[0]) : null;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: IInfoSectionInput & ISeoMetaInput) => {
    try {
      console.log("Form values:", values);
      const {
        pageTitle,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        robotsMeta,
        ogTitle,
        ogDescription,
        ogImage,
        ...infoSectionData
      } = values;

      if (infoSection?.id) {
        await updateInfoSection(infoSectionData);
      } else {
        await createInfoSection(infoSectionData);
      }

      const seoMetaData: Omit<ISeoMetaInput, "_id"> & ISeoMetaInput = {
        pageTitle,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        robotsMeta,
        ogTitle,
        ogDescription,
        ogImage,
      };

      if (seoMeta?._id) {
        await updateSeoMeta(seoMeta._id, seoMetaData);
      } else {
        await createSeoMeta(seoMetaData);
      }

      toast({
        title: "Success",
        description: "Settings updated successfully.",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };
  console.log("seoMeta: ", seoMeta);

  const handleDelete = async () => {
    try {
      await Promise.all([
        deleteInfoSection(),
        seoMeta?._id ? deleteSeoMeta(seoMeta._id) : Promise.resolve(),
      ]);
      setInfoSection(null);
      setSeoMeta(null);
      toast({
        title: "Success",
        description: "Settings deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete settings:", error);
      toast({
        title: "Error",
        description: "Failed to delete settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const initialValues: IInfoSectionInput & ISeoMetaInput = {
    location: infoSection?.location || "",
    phoneNumber: infoSection?.phoneNumber || "",
    email: infoSection?.email || "",
    socialLinks: {
      instagram: infoSection?.socialLinks?.instagram || "",
      facebook: infoSection?.socialLinks?.facebook || "",
      twitter: infoSection?.socialLinks?.twitter || "",
      linkedin: infoSection?.socialLinks?.linkedin || "",
      youtube: infoSection?.socialLinks?.youtube || "",
    },
    pageTitle: seoMeta?.pageTitle || "",
    metaTitle: seoMeta?.metaTitle || "",
    metaDescription: seoMeta?.metaDescription || "",
    metaKeywords: seoMeta?.metaKeywords || [],
    canonicalUrl: seoMeta?.canonicalUrl || "",
    robotsMeta: seoMeta?.robotsMeta || "index, follow",
    ogTitle: seoMeta?.ogTitle || "",
    ogDescription: seoMeta?.ogDescription || "",
    ogImage: seoMeta?.ogImage || "",
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <motion.h1
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Settings
        </motion.h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, setFieldValue }) => (
            <Form>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* General Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="w-5 h-5 text-red-600 mr-2" />
                    <h2 className="text-lg font-semibold">General Settings</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={values.location}
                        onChange={handleChange}
                        className={
                          errors.location && touched.location
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.location && touched.location && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.location}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        className={
                          errors.phoneNumber && touched.phoneNumber
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.phoneNumber && touched.phoneNumber && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.phoneNumber}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        className={
                          errors.email && touched.email ? "border-red-500" : ""
                        }
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <Mail className="w-5 h-5 text-red-600 mr-2" />
                    <h2 className="text-lg font-semibold">Social Links</h2>
                  </div>
                  <div className="space-y-4">
                    {Object.keys(initialValues.socialLinks || {}).map((key) => (
                      <div key={key}>
                        <Label
                          htmlFor={`socialLinks.${key}`}
                          className="capitalize"
                        >
                          {key}
                        </Label>
                        <Input
                          id={`socialLinks.${key}`}
                          name={`socialLinks.${key}`}
                          type="url"
                          value={
                            values.socialLinks?.[
                              key as keyof typeof values.socialLinks
                            ] || ""
                          }
                          onChange={handleChange}
                          className={
                            errors.socialLinks?.[
                              key as keyof typeof errors.socialLinks
                            ] &&
                            touched.socialLinks?.[
                              key as keyof typeof touched.socialLinks
                            ]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.socialLinks?.[
                          key as keyof typeof errors.socialLinks
                        ] &&
                          touched.socialLinks?.[
                            key as keyof typeof touched.socialLinks
                          ] && (
                            <div className="text-red-500 text-sm mt-1">
                              {errors.socialLinks}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* SEO Meta Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    SEO Meta Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pageTitle">Page Title</Label>
                      <Input
                        id="pageTitle"
                        name="pageTitle"
                        value={values.pageTitle}
                        onChange={handleChange}
                        className={
                          errors.pageTitle && touched.pageTitle
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.pageTitle && touched.pageTitle && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.pageTitle}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        name="metaTitle"
                        value={values.metaTitle}
                        onChange={handleChange}
                        className={
                          errors.metaTitle && touched.metaTitle
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.metaTitle && touched.metaTitle && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.metaTitle}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        name="metaDescription"
                        value={values.metaDescription}
                        onChange={handleChange}
                        className={
                          errors.metaDescription && touched.metaDescription
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.metaDescription && touched.metaDescription && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.metaDescription}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="metaKeywords">Meta Keywords</Label>
                      <Input
                        id="metaKeywords"
                        name="metaKeywords"
                        value={values.metaKeywords?.join(", ")}
                        onChange={(e) => {
                          const keywords = e.target.value
                            .split(",")
                            .map((k) => k.trim());
                          setFieldValue("metaKeywords", keywords);
                        }}
                        className={
                          errors.metaKeywords && touched.metaKeywords
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.metaKeywords && touched.metaKeywords && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.metaKeywords}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="canonicalUrl">Canonical URL</Label>
                      <Input
                        id="canonicalUrl"
                        name="canonicalUrl"
                        type="url"
                        value={values.canonicalUrl}
                        onChange={handleChange}
                        className={
                          errors.canonicalUrl && touched.canonicalUrl
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.canonicalUrl && touched.canonicalUrl && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.canonicalUrl}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="robotsMeta">Robots Meta Tag</Label>
                      <Select
                        onValueChange={(value) =>
                          setFieldValue("robotsMeta", value)
                        }
                        defaultValue={values.robotsMeta}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select robots meta tag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="index, follow">
                            Index, Follow
                          </SelectItem>
                          <SelectItem value="noindex, follow">
                            No Index, Follow
                          </SelectItem>
                          <SelectItem value="index, nofollow">
                            Index, No Follow
                          </SelectItem>
                          <SelectItem value="noindex, nofollow">
                            No Index, No Follow
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.robotsMeta && touched.robotsMeta && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.robotsMeta}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ogTitle">OG Title</Label>
                      <Input
                        id="ogTitle"
                        name="ogTitle"
                        value={values.ogTitle}
                        onChange={handleChange}
                        className={
                          errors.ogTitle && touched.ogTitle
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.ogTitle && touched.ogTitle && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.ogTitle}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ogDescription">OG Description</Label>
                      <Textarea
                        id="ogDescription"
                        name="ogDescription"
                        value={values.ogDescription}
                        onChange={handleChange}
                        className={
                          errors.ogDescription && touched.ogDescription
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.ogDescription && touched.ogDescription && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.ogDescription}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ogImage">OG Image URL</Label>
                      <Input
                        id="ogImage"
                        name="ogImage"
                        type="url"
                        value={values.ogImage}
                        onChange={handleChange}
                        className={
                          errors.ogImage && touched.ogImage
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.ogImage && touched.ogImage && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.ogImage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-6 flex justify-end space-x-4">
                <Button type="submit">
                  {infoSection?.id || seoMeta?._id
                    ? "Update Settings"
                    : "Add Settings"}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Settings
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the settings.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AdminLayout>
  );
};

export default Settings;
