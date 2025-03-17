/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IBookMembershipInput } from "@/types/bookMembership";
import { Card, CardContent } from "@/components/ui/card";

interface PersonalInformationFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldValue: (field: string, value: any) => void;
  values: IBookMembershipInput;
  errors: any;
  touched: any;
  onImageUpload: (file: File) => void;
}

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({
  setFieldValue,
  values,
  errors,
  touched,
  onImageUpload,
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    console.log("Uploaded image", values.image);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={values.name}
            onChange={(e) => setFieldValue("name", e.target.value)}
            className={errors.name && touched.name ? "border-green-500" : ""}
          />
          {errors.name && touched.name && (
            <p className="text-green-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={(e) => setFieldValue("email", e.target.value)}
            className={errors.email && touched.email ? "border-green-500" : ""}
          />
          {errors.email && touched.email && (
            <p className="text-green-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={values.phoneNumber}
            onChange={(e) => setFieldValue("phoneNumber", e.target.value)}
            className={
              errors.phoneNumber && touched.phoneNumber
                ? "border-green-500"
                : ""
            }
          />
          {errors.phoneNumber && touched.phoneNumber && (
            <p className="text-green-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="mailingAddress.street">Street Address</Label>
        <Input
          id="mailingAddress.street"
          name="mailingAddress.street"
          value={values.mailingAddress.street}
          onChange={(e) =>
            setFieldValue("mailingAddress.street", e.target.value)
          }
          className={
            errors.mailingAddress?.street && touched.mailingAddress?.street
              ? "border-green-500"
              : ""
          }
        />
        {errors.mailingAddress?.street && touched.mailingAddress?.street && (
          <p className="text-green-500 text-sm mt-1">
            {errors.mailingAddress.street}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="mailingAddress.city">City</Label>
          <Input
            id="mailingAddress.city"
            name="mailingAddress.city"
            value={values.mailingAddress.city}
            onChange={(e) =>
              setFieldValue("mailingAddress.city", e.target.value)
            }
            className={
              errors.mailingAddress?.city && touched.mailingAddress?.city
                ? "border-green-500"
                : ""
            }
          />
          {errors.mailingAddress?.city && touched.mailingAddress?.city && (
            <p className="text-green-500 text-sm mt-1">
              {errors.mailingAddress.city}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="mailingAddress.state">State/Province</Label>
          <Input
            id="mailingAddress.state"
            name="mailingAddress.state"
            value={values.mailingAddress.state}
            onChange={(e) =>
              setFieldValue("mailingAddress.state", e.target.value)
            }
            className={
              errors.mailingAddress?.state && touched.mailingAddress?.state
                ? "border-green-500"
                : ""
            }
          />
          {errors.mailingAddress?.state && touched.mailingAddress?.state && (
            <p className="text-green-500 text-sm mt-1">
              {errors.mailingAddress.state}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="mailingAddress.postalCode">Postal Code</Label>
          <Input
            id="mailingAddress.postalCode"
            name="mailingAddress.postalCode"
            value={values.mailingAddress.postalCode}
            onChange={(e) =>
              setFieldValue("mailingAddress.postalCode", e.target.value)
            }
            className={
              errors.mailingAddress?.postalCode &&
              touched.mailingAddress?.postalCode
                ? "border-green-500"
                : ""
            }
          />
          {errors.mailingAddress?.postalCode &&
            touched.mailingAddress?.postalCode && (
              <p className="text-green-500 text-sm mt-1">
                {errors.mailingAddress.postalCode}
              </p>
            )}
        </div>
        <div>
          <Label htmlFor="mailingAddress.country">Country</Label>
          <Input
            id="mailingAddress.country"
            name="mailingAddress.country"
            value={values.mailingAddress.country}
            onChange={(e) =>
              setFieldValue("mailingAddress.country", e.target.value)
            }
            className={
              errors.mailingAddress?.country && touched.mailingAddress?.country
                ? "border-green-500"
                : ""
            }
          />
          {errors.mailingAddress?.country &&
            touched.mailingAddress?.country && (
              <p className="text-green-500 text-sm mt-1">
                {errors.mailingAddress.country}
              </p>
            )}
        </div>
      </div>
      <div>
        <Label htmlFor="image">Personal Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={errors.image && touched.image ? "border-green-500" : ""}
        />
        {errors.image && touched.image && (
          <p className="text-green-500 text-sm mt-1">
            {errors.image as string}
          </p>
        )}
        {values.image && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <img
                src={
                  URL.createObjectURL(values.image as File) ||
                  "/placeholder.svg"
                }
                alt="Personal"
                className="max-w-full h-auto rounded-lg"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PersonalInformationForm;
