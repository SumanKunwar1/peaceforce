import type React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IBookMembershipInput } from "@/types/bookMembership";
import { Input } from "@/components/ui/input";

interface PaymentInformationFormProps {
  membershipType: string;
  fee: number;
  fullName: string;
  email: string;
  exchangeRate: number | null;
  currencyCode: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldValue: (field: string, value: any) => void;
  values: IBookMembershipInput;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  touched: any;
  onImageUpload: (file: File) => void;
}

const PaymentInformationForm: React.FC<PaymentInformationFormProps> = ({
  membershipType,
  fee,
  fullName,
  email,
  exchangeRate,
  currencyCode,
  setFieldValue,
  values,
  errors,
  touched,
  onImageUpload,
}) => {
  const paymentMethods = [
    { value: "bank", label: "Bank Transfer" },
    { value: "esewa", label: "eSewa" },
    { value: "khalti", label: "Khalti" },
  ];

  const convertCurrency = (amount: number) => {
    if (!exchangeRate) return "Loading...";
    const convertedAmount = Math.ceil(amount * exchangeRate);
    return `${convertedAmount.toLocaleString()} ${currencyCode}`;
  };

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case "NPR":
        return "₨";
      case "INR":
        return "₹";
      case "USD":
        return "$";
      // Add more currency symbols as needed
      default:
        return code;
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Payment Information
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Membership Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Type:</strong> {membershipType}
          </p>
          <p>
            <strong>Fee:</strong> {getCurrencySymbol(currencyCode)}{" "}
            {convertCurrency(fee)}
          </p>
          <p>
            <strong>Name:</strong> {fullName}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Label>Payment Method</Label>
        <RadioGroup
          value={values.paymentMethod}
          onValueChange={(value) => setFieldValue("paymentMethod", value)}
        >
          {paymentMethods.map((method) => (
            <div
              key={method.value}
              className="flex items-center space-x-4 cursor-pointer"
            >
              <RadioGroupItem
                value={method.value}
                id={method.value}
                className="w-6 h-6 rounded-full border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <Label htmlFor={method.value} className="text-lg">
                {method.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {errors.paymentMethod && touched.paymentMethod && (
          <p className="text-green-500 text-sm mt-1">{errors.paymentMethod}</p>
        )}
      </div>

      {values.paymentMethod === "bank" && (
        <div className="space-y-4 mt-4">
          <h3 className="text-xl font-semibold">Bank Transfer Details</h3>
          <Card className="p-4">
            <CardContent>
              <div className="flex gap-4 p-2">
                <div className="space-y-2">
                  <p>
                    <strong>Beneficiary Name:</strong> B.T.M.C. Foundation
                  </p>
                  <p>
                    <strong>Bank Name:</strong> NMB Bank
                  </p>
                  <p>
                    <strong>SWIFT:</strong> NMBBNPKA
                  </p>
                  <p>
                    <strong>A/C No.:</strong> 2222410016305780
                  </p>
                  <p>
                    <strong>Branch:</strong> Boudha Branch, Kathmandu, Nepal
                  </p>
                </div>
                <div className="ml-2">
                  <img
                    src="/assets/btmcqrcode.jpg"
                    alt=""
                    className="h-auto w-56 "
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {values.paymentMethod === "esewa" && (
        <div className="space-y-4 mt-4">
          <h3 className="text-xl font-semibold">eSewa Details</h3>
          <Card className="p-4">
            <CardContent>
              <p>
                <strong>eSewa Number:</strong> 9849118562
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {values.paymentMethod === "khalti" && (
        <div className="space-y-4 mt-4">
          <h3 className="text-xl font-semibold">Khalti Details</h3>
          <Card className="p-4">
            <CardContent>
              <p>
                <strong>Khalti Number:</strong> 9849118562
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <Label htmlFor="paymentScreenshot">Payment Screenshot</Label>
        <Input
          id="paymentScreenshot"
          name="paymentScreenshot"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={
            errors.paymentScreenshot && touched.paymentScreenshot
              ? "border-green-500"
              : ""
          }
        />
        {errors.paymentScreenshot && touched.paymentScreenshot && (
          <p className="text-green-500 text-sm mt-1">
            {errors.paymentScreenshot}
          </p>
        )}
        {values.paymentScreenshot && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <img
                src={
                  URL.createObjectURL(values.paymentScreenshot as File) ||
                  "/placeholder.svg"
                }
                alt="Payment Screenshot"
                className="max-w-full h-auto rounded-lg"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentInformationForm;
