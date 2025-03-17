"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type {
  IBookMembershipInput,
  IMembershipTypes,
} from "@/types/bookMembership";
import { createBookMembership } from "@/lib/bookMembershipApi";
import { getMemberships } from "@/lib/membershipApi";
import MembershipSelection from "./MembershipSelection";
import PersonalInformationForm from "./PersonalInformation";
import PaymentInformationForm from "./PaymentInformation";
import { Progress } from "@/components/ui/progress";
import { Helmet } from "react-helmet-async";

interface MembershipFormProps {
  onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  membershipId: Yup.string().required("Membership type is required"),
  amount: Yup.number().required("Fee is required"),
  paymentMethod: Yup.string()
    .oneOf(["bank", "esewa", "khalti"])
    .required("Payment method is required"),
  mailingAddress: Yup.object().shape({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string(),
    postalCode: Yup.string().required("Postal code is required"),
    country: Yup.string().required("Country is required"),
  }),
  image: Yup.mixed().required("Personal image is required"),
  paymentScreenshot: Yup.mixed().required("Payment screenshot is required"),
});

const fetchExchangeRate = async (currencyCode: string) => {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/079db54db48bef4fafe46bff/latest/USD`
    );
    const data = await response.json();
    const rate = data.conversion_rates[currencyCode];
    return rate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

const fetchUserLocation = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const location = await res.json();
    return location.country_name;
  } catch (error) {
    console.error("Error fetching user location:", error);
    return "Nepal"; // Default fallback to Nepal
  }
};

const MembershipForm: React.FC<MembershipFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [progress, setProgress] = useState(33);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [currencyCode, setCurrencyCode] = useState("NPR");
  const [membershipOptions, setMembershipOptions] = useState<
    IMembershipTypes[]
  >([]);

  useEffect(() => {
    setProgress(step * 33);
  }, [step]);

  useEffect(() => {
    const getCurrencyDetails = async () => {
      const userLocation = await fetchUserLocation();
      console.log("User location:", userLocation);
      let userCurrency = "NPR";
      if (userLocation === "India") {
        userCurrency = "INR";
      } else if (userLocation === "USA") {
        userCurrency = "USD";
      }

      // Add more conditions for other locations as needed
      const rate = await fetchExchangeRate(userCurrency);
      if (rate) {
        setCurrencyCode(userCurrency);
        setExchangeRate(rate);
      }
    };
    getCurrencyDetails();
  }, []);

  useEffect(() => {
    const fetchMembershipOptions = async () => {
      try {
        const { memberships } = await getMemberships();
        setMembershipOptions(
          memberships.map((membership: any) => ({
            ...membership,
            benefits: Array.isArray(membership.benefits)
              ? membership.benefits
              : membership.benefits
                  .split(",")
                  .map((benefit: any) => benefit.trim()),
          }))
        );
      } catch (error) {
        console.error("Error fetching membership options:", error);
        toast({
          title: "Error",
          description:
            "Failed to fetch membership options. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchMembershipOptions();
  }, [toast]);

  console.log("Membership options:", membershipOptions);

  const handleSubmit = async (values: IBookMembershipInput) => {
    try {
      console.log("Form values:", values);
      const response = await createBookMembership(values);
      console.log("Membership booked successfully:", response);
      toast({
        title: "Submission successfull",
        description: "Thank you for becoming the B.T.M.C. Foundation Member.",
      });
      onSuccess();
    } catch (error) {
      console.error("Error booking membership:", error);
      toast({
        title: "Error",
        description:
          "Failed to book membership. Please check the console for details.",
        variant: "destructive",
      });
    }
  };

  const initialValues: IBookMembershipInput = {
    name: "",
    email: "",
    phoneNumber: "",
    membershipId: "",
    amount: 0,
    paymentMethod: "bank",
    mailingAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nepal",
    },
    image: null,
    page: "/membership",
    pageTitle: "Membership Application",
    paymentScreenshot: null,
  };

  const isStepValid = (
    currentStep: number,
    values: IBookMembershipInput,
    errors: any
  ) => {
    switch (currentStep) {
      case 1:
        return !!values.membershipId;
      case 2:
        return !!(
          values.name &&
          values.email &&
          values.phoneNumber &&
          values.mailingAddress.street &&
          values.mailingAddress.city &&
          values.mailingAddress.postalCode &&
          values.mailingAddress.country &&
          values.image &&
          !errors.name &&
          !errors.email &&
          !errors.phoneNumber &&
          !errors.mailingAddress?.street &&
          !errors.mailingAddress?.city &&
          !errors.mailingAddress?.postalCode &&
          !errors.mailingAddress?.country &&
          !errors.image
        );
      case 3:
        return true; // Handle in submit button since it's the final step
      default:
        return false;
    }
  };

  return (
    <>
      {membershipOptions.map((option) => (
        <Helmet>
          <title>{option.metaTitle}</title>
          <meta name="description" content={option.metaDescription} />
          <meta name="keywords" content={option?.metaKeywords?.join(", ")} />
        </Helmet>
      ))}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched, isValid }) => (
          <Form className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
            <div className="p-8">
              <Progress value={progress} className="mb-8" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <MembershipSelection
                      options={membershipOptions}
                      selectedType={values.membershipId}
                      onSelect={(id) => {
                        const selectedMembership = membershipOptions.find(
                          (option) => option.id === id
                        );
                        if (selectedMembership) {
                          setFieldValue("membershipId", id);
                          setFieldValue("amount", selectedMembership.fee);
                        }
                      }}
                      exchangeRate={exchangeRate}
                      currencyCode={currencyCode}
                    />
                  )}
                  {step === 2 && (
                    <PersonalInformationForm
                      setFieldValue={setFieldValue}
                      values={values}
                      errors={errors}
                      touched={touched}
                      onImageUpload={(file: File) => {
                        setFieldValue("image", file);
                      }}
                    />
                  )}
                  {step === 3 && (
                    <PaymentInformationForm
                      membershipType={values.membershipId}
                      fee={values.amount}
                      fullName={values.name}
                      email={values.email}
                      exchangeRate={exchangeRate}
                      currencyCode={currencyCode}
                      setFieldValue={setFieldValue}
                      values={values}
                      errors={errors}
                      touched={touched}
                      onImageUpload={(file: File) => {
                        setFieldValue("paymentScreenshot", file);
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-8 py-4 flex justify-between items-center">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                >
                  Previous
                </Button>
              )}
              {step < 3 && (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepValid(step, values, errors)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Next
                </Button>
              )}
              {step === 3 && (
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Submit
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default MembershipForm;
