import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface SupportHeroProps {
  heroData: {
    title?: string;
    subtitle?: string;
    image: File | string;
  };
}

const SupportHero: React.FC<SupportHeroProps> = ({ heroData }) => {
  return (
    <section className="relative py-12 bg-green-600">
      <div className="absolute inset-0 "></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-center space-x-4">
          <Heart className="w-12 h-12 text-white" />
          <div>
            <motion.h1
              className="text-4xl font-bold text-white mb-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {heroData.title || "Support Us"}
            </motion.h1>
            <motion.p
              className="text-green-100 text-lg"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {heroData.subtitle ||
                "Support our efforts to combat youth violence and empower young people for a brighter future"}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportHero;
