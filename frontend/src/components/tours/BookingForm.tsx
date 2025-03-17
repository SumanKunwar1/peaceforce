import React, { useState } from "react";
import { IBookingData } from "../../types/bookings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "../../lib/bookings";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IBookingData) => void;
  tourTitle: string;
  tourId: string; // Ensure tourId is passed as a prop
}

const BookingForm: React.FC<BookingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tourTitle,
  tourId,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<IBookingData>({
    name: "",
    email: "",
    phoneNumber: "",
    participants: 1,
    specialRequests: "",
    page: "tour-booking", // Default value for page
    pageTitle: tourTitle, // Use tourTitle for pageTitle
    tourId: tourId, // Ensure tourId is included
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate tourId
      if (!formData.tourId || typeof formData.tourId !== "string") {
        throw new Error("Invalid tourId");
      }

      const response = await createBooking(formData);
      onSubmit(response);
      onClose();
      toast({
        title: "Booking Successful",
        description: "Your tour has been booked successfully.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Failed to submit booking:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your tour. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Book Tour</DialogTitle>
          <DialogDescription>{tourTitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
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
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="phoneNumber">Phone</Label>
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
            <Label htmlFor="participants">Number of Participants</Label>
            <Input
              id="participants"
              type="number"
              required
              min="1"
              value={formData.participants}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  participants: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specialRequests: e.target.value,
                })
              }
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-700"
          >
            Submit Booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
