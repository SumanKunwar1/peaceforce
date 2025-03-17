"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { createDonation } from "@/lib/donations";
import { useToast } from "@/hooks/use-toast";
import type { SupportWay, IDonationInput } from "@/types/donation";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportWay: SupportWay | null;
}
interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportWay: SupportWay | null;
}

const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  supportWay,
}) => {
  const [formData, setFormData] = useState<IDonationInput>({
    name: "",
    email: "",
    phoneNumber: "",
    amount: 0,
    paymentMethod: "bank",
    page: "/support",
    pageTitle: supportWay?.title,
  });

  useEffect(() => {
    if (supportWay?.title) {
      setFormData((prev) => ({ ...prev, pageTitle: supportWay.title }));
    }
  }, [supportWay]);

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if the pageTitle is "volunteer" or "Volunteer"
      const isVolunteer = formData.pageTitle?.toLowerCase() === "volunteer";

      if (isVolunteer) {
        // For volunteer submissions, use /api/user endpoint
        const volunteerData = {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          page: formData.page,
          pageTitle: formData.pageTitle,
          role: "volunteer",
        };

        console.log("volunteerData", volunteerData);

        // Call the user API endpoint for volunteers
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(volunteerData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit volunteer application");
        }

        toast({
          title: "Application Submitted Successfully",
          description: `Thank you for volunteering with us.`,
        });
      } else {
        // For non-volunteer submissions (donations), use /api/donation endpoint
        const donationData = new FormData();

        // Include all fields for donations
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== "paymentMethod") {
            donationData.append(key, value);
          }
        });

        if (screenshot) {
          donationData.append("screenshot", screenshot);
        }

        console.log("donationData", donationData);

        const donation = await createDonation(donationData);
        toast({
          title: "Support Submitted Successfully",
          description: `Thank you for your ${supportWay?.title.toLowerCase()} of $${
            donation.amount
          }.`,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error submitting support:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error processing your submission. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderPaymentDetails = () => {
    switch (formData.paymentMethod) {
      case "bank":
        return (
          <Card>
            <CardContent className="space-y-2 mt-4">
              <h4 className="font-semibold">Bank Transfer Details</h4>
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
            </CardContent>
          </Card>
        );
      case "esewa":
        return (
          <Card>
            <CardContent className="space-y-2 mt-4">
              <h4 className="font-semibold">eSewa Details</h4>
              <p>
                <strong>eSewa Number:</strong> 9849118562
              </p>
            </CardContent>
          </Card>
        );
      case "khalti":
        return (
          <Card>
            <CardContent className="space-y-2 mt-4">
              <h4 className="font-semibold">Khalti Details</h4>
              <p>
                <strong>Khalti Number:</strong> 9849118562
              </p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  if (!supportWay) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{supportWay.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="prose max-w-none">
            <p className="text-gray-600">{supportWay.fullDescription}</p>
            <h3 className="text-xl font-semibold mt-6 mb-4">Benefits</h3>
            <ul className="list-disc list-inside space-y-2">
              {supportWay.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-600">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>
            {supportWay.title !== "Volunteer" && (
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                />
              </div>
            )}
            {supportWay.title !== "Volunteer" && (
              <div>
                <Label>Payment Method</Label>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Bank Transfer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="esewa" id="esewa" />
                    <Label htmlFor="esewa">eSewa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="khalti" id="khalti" />
                    <Label htmlFor="khalti">Khalti</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            {supportWay.title !== "Volunteer" && renderPaymentDetails()}
            {supportWay.title !== "Volunteer" && (
              <div>
                <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              {supportWay.title === "Volunteer"
                ? "Submit Application"
                : "Confirm Support"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportModal;
