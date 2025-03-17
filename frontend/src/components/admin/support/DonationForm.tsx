import React, { useState } from "react";

interface DonationFormProps {
  supportType: string;
}

const DonationForm: React.FC<DonationFormProps> = ({ supportType }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    frequency: supportType === "Monthly Giving" ? "monthly" : "one-time",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      contentEditable
      suppressContentEditableWarning
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      {["One-time Donation", "Monthly Giving"].includes(supportType) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
      >
        {supportType === "Volunteer"
          ? "Submit Application"
          : "Proceed to Payment"}
      </button>
    </form>
  );
};

export default DonationForm;
