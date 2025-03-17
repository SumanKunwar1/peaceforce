import { motion } from "framer-motion";
import { Users, BookOpen, Heart, Globe } from "lucide-react";

interface Impact {
  icon: string;
  number: string;
  title: string;
  description: string;
}

interface ImpactSectionProps {
  impacts: Impact[];
}

const iconMap: { [key: string]: React.ElementType } = {
  Users,
  BookOpen,
  Heart,
  Globe,
};

const ImpactSection: React.FC<ImpactSectionProps> = ({ impacts }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-gray-600">
            Your support helps us make a difference
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => {
            const Icon = iconMap[impact.icon] || Users;
            return (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-green-600 mb-2">
                  {impact.number}
                </h3>
                <h4 className="text-xl font-semibold mb-2">{impact.title}</h4>
                <p className="text-gray-600">{impact.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
