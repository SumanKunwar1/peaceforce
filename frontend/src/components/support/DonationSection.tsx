import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, Heart } from "lucide-react";
import { createDonation } from "@/lib/donations";
import { useToast } from "@/hooks/use-toast";
import { IDonationInput } from "@/types/donation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DonationSectionProps {
  heroImage?: string | File | null;
}

const DonationSection: React.FC<DonationSectionProps> = ({ heroImage }) => {
  const [formData, setFormData] = useState<IDonationInput>({
    name: "",
    email: "",
    phoneNumber: "",
    amount: 0,
    paymentMethod: "bank",
    page: "/support",
    pageTitle: "Make a Donation",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const { toast } = useToast();

  const getBackgroundImage = () => {
    if (typeof heroImage === "string") {
      return heroImage;
    } else if (heroImage instanceof File) {
      return URL.createObjectURL(heroImage);
    }
    return "/src/Assets/BTMC-Hero-Banner-1.png";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleConfirmDonation = async () => {
    try {
      const donationData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "paymentMethod") {
          donationData.append(key, value.toString());
        }
      });
      if (screenshot) {
        donationData.append("screenshot", screenshot);
      }

      const donation = await createDonation(donationData);
      toast({
        title: "Donation Successful",
        description: `Thank you for your donation of $${donation.amount}.`,
      });
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        amount: 0,
        paymentMethod: "bank",
        page: "/support",
        pageTitle: "Make a Donation",
      });
      setScreenshot(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast({
        title: "Donation Failed",
        description:
          "There was an error processing your donation. Please try again.",
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
                <strong>Beneficiary Name:</strong>PeaceForce
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
                <strong>Branch:</strong>Kathmandu, Nepal
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

  return (
    <section className="py-16 relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${getBackgroundImage()})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Support Our Mission</h2>
            <p className="text-xl mb-8">
              Your generous donation helps us maintain our facilities, support
              our teachers, and continue providing Buddhist education and
              meditation programs to our community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: DollarSign,
                  title: "Transparent",
                  text: "Clear use of funds",
                },
                { icon: Users, title: "Impactful", text: "Helping thousands" },
                { icon: Heart, title: "Meaningful", text: "Supporting dharma" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: index * 0.1 }}
                >
                  <item.icon className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-md text-gray-200">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Make a Donation</h3>
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
              <div>
                <Label htmlFor="amount">Donation Amount</Label>
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
              {renderPaymentDetails()}
              <Button
                type="submit"
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                Donate Now
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Confirm Your Donation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Thank you for your generous donation of ${formData.amount}. Please
              confirm the details below and upload a screenshot of your payment.
            </p>
            <Card>
              <CardContent className="space-y-2 mt-4">
                <p>
                  <strong>Name:</strong> {formData.name}
                </p>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {formData.phoneNumber}
                </p>
                <p>
                  <strong>Amount:</strong> ${formData.amount}
                </p>
                <p>
                  <strong>Payment Method:</strong> {formData.paymentMethod}
                </p>
              </CardContent>
            </Card>
            <div>
              <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              />
            </div>
            {screenshot && (
              <div>
                <p>Preview:</p>
                <img
                  src={URL.createObjectURL(screenshot) || "/placeholder.svg"}
                  alt="Payment Screenshot"
                  className="max-w-full h-auto"
                />
              </div>
            )}
            <Button
              onClick={handleConfirmDonation}
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              Confirm Donation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DonationSection;
