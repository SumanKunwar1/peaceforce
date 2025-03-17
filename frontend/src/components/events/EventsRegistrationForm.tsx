"use client";

import type React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Event, EventRegistrationData } from "@/types/event";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { bookEvent } from "@/lib/book-events";

interface EventRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be numbers only")
    .required("Phone number is required"),
  ticketType: Yup.string()
    .oneOf(["VVIP", "VIP", "Regular"] as const)
    .required("Ticket type is required"),
  quantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  specialRequirements: Yup.string().optional(),
});

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { toast } = useToast();

  const formik = useFormik<
    Omit<EventRegistrationData, "page" | "pageTitle" | "eventId">
  >({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      ticketType: "Regular",
      quantity: 1,
      specialRequirements: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsConfirmationOpen(true);
      console.assert(values);
    },
  });

  const handleConfirm = async () => {
    try {
      const bookingData: EventRegistrationData = {
        ...formik.values,
        page: window.location.pathname,
        pageTitle: event.title,
        eventId: event.id,
      };
      await bookEvent(bookingData);
      setIsConfirmationOpen(false);
      onClose();
      toast({
        title: "Booking Successful",
        description: "Your tour has been booked successfully.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error booking event:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your tour. Please try again.",
        duration: 4000,
        variant: "destructive",
      });
    }
  };

  const selectedTicket = event.ticketTypes.find(
    (ticket) => ticket.type === formik.values.ticketType
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Book Your Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...formik.getFieldProps("name")}
                className="mt-1"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...formik.getFieldProps("email")}
                className="mt-1"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="1234567890"
                {...formik.getFieldProps("phoneNumber")}
                className="mt-1"
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.phoneNumber}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                {event.ticketTypes.map((ticket) => (
                  <div
                    key={ticket.type}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                      formik.values.ticketType === ticket.type
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                    onClick={() => {
                      formik.setFieldValue("ticketType", ticket.type);
                      formik.setFieldTouched("ticketType", true, false);
                    }}
                  >
                    <div className="font-semibold">{ticket.type}</div>
                    <div className="text-red-600">Rs. {ticket.price}</div>
                  </div>
                ))}
              </div>
              {formik.touched.ticketType && formik.errors.ticketType && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.ticketType}
                </div>
              )}
            </div>

            {selectedTicket && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-semibold">Selected Ticket:</p>
                <p>
                  {selectedTicket.type} - Rs. {selectedTicket.price}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                min={1}
                {...formik.getFieldProps("quantity")}
                onChange={(e) =>
                  formik.setFieldValue(
                    "quantity",
                    Number.parseInt(e.target.value, 10)
                  )
                }
                className="mt-1"
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.quantity}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="specialRequirements"
                className="block text-sm font-medium text-gray-700"
              >
                Special Requirements (Optional)
              </label>
              <Textarea
                id="specialRequirements"
                placeholder="Any special requirements..."
                {...formik.getFieldProps("specialRequirements")}
                className="mt-1"
              />
              {formik.touched.specialRequirements &&
                formik.errors.specialRequirements && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.specialRequirements}
                  </div>
                )}
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 text-white hover:bg-red-700"
            >
              Book Now
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Please review your booking details:
              <ul className="mt-2 space-y-1">
                <li>Name: {formik.values.name}</li>
                <li>Email: {formik.values.email}</li>
                <li>Phone: {formik.values.phoneNumber}</li>
                <li>Ticket Type: {formik.values.ticketType}</li>
                <li>Quantity: {formik.values.quantity}</li>
                <li>
                  Total Price: Rs.{" "}
                  {selectedTicket
                    ? selectedTicket.price * formik.values.quantity
                    : 0}
                </li>
                {formik.values.specialRequirements && (
                  <li>
                    Special Requirements: {formik.values.specialRequirements}
                  </li>
                )}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmationOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Confirm Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventRegistrationForm;
