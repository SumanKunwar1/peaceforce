"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import type { IMembershipTypes } from "@/types/bookMembership";

interface MembershipSelectionProps {
  options: IMembershipTypes[];
  selectedType: string;
  onSelect: (id: string) => void;
  exchangeRate: number | null;
  currencyCode: string;
}

const MembershipSelection: React.FC<MembershipSelectionProps> = ({
  options,
  selectedType,
  onSelect,
  exchangeRate,
  currencyCode,
}) => {
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

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Choose Your Membership
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
        {options.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`h-full transition-all duration-300 ${
                selectedType === option.id
                  ? "border-red-600 shadow-lg bg-red-100 transform scale-105"
                  : "hover:border-red-300"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-xl text-red-800">
                  {option.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {option.duration === "lifetime"
                    ? "Lifetime"
                    : `${option.duration} year(s)`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl text-red-900 font-bold mb-6">
                  {getCurrencySymbol(currencyCode)}{" "}
                  {convertCurrency(option.fee)}
                </p>
                <ul className="space-y-2">
                  {option.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => onSelect(option.id)}
                  variant={selectedType === option.id ? "default" : "outline"}
                  className={`w-full ${
                    selectedType === option.id
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : ""
                  }`}
                >
                  {selectedType === option.id ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MembershipSelection;
