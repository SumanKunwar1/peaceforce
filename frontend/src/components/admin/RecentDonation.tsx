"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { IDonationData } from "../../types/donation";
import { Link } from "react-router-dom";

interface RecentDonationsProps {
  donations: IDonationData[];
}

const RecentDonations: React.FC<RecentDonationsProps> = ({ donations }) => {
  const recentDonations = donations.slice(0, 10);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-semibold mb-4">Recent Donations</h2>
      <div className="space-y-4">
        {recentDonations.map((donation) => (
          <div key={donation._id} className="flex items-start space-x-4">
            <div className="bg-red-100 text-red-600 p-2 rounded-lg">
              <Heart className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  {donation.userId.name}
                </span>{" "}
                donated{" "}
                <span className="font-medium text-gray-900">
                  ${donation.amount}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(donation.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/admin/donations"
        className="mt-4 text-sm text-red-600 hover:text-red-700"
      >
        <button className="mt-4 text-sm text-red-600 hover:text-red-700">
          View all donations →
        </button>
      </Link>
    </motion.div>
  );
};

export default RecentDonations;
