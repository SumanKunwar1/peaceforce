import React, { useState } from "react";
import { motion } from "framer-motion";
import SupportModal from "./SupportModal";
import { DollarSign, Users, Heart, Globe } from "lucide-react";
import { SupportWay } from "@/types/donation";

interface SupportWaysProps {
  waysToSupport: SupportWay[];
}

const iconMap: { [key: string]: React.ElementType } = {
  DollarSign,
  Users,
  Heart,
  Globe,
};

const SupportWays: React.FC<SupportWaysProps> = ({ waysToSupport }) => {
  const [selectedWay, setSelectedWay] = useState<SupportWay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLearnMore = (way: SupportWay) => {
    setSelectedWay(way);
    setIsModalOpen(true);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
        >
          <h2 className="text-3xl font-bold mb-4">Ways to Support</h2>
          <p className="text-gray-600">
            Choose how you'd like to contribute to our mission
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {waysToSupport.map((way, index) => {
            const Icon = iconMap[way.icon] || Heart;
            return (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{way.title}</h3>
                <p className="text-gray-600">{way.description}</p>
                <button
                  onClick={() => handleLearnMore(way)}
                  className="mt-4 text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  Learn More →
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <SupportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supportWay={selectedWay}
      />
    </section>
  );
};

export default SupportWays;
