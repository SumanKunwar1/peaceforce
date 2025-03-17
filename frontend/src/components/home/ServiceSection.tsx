import { Link } from "react-router-dom";
import { BookOpen, Map, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: BookOpen,
    title: "Buddhist Teachings & Meditation",
    description:
      "Comprehensive courses for monks, nuns, and lay practitioners.",
    link: "/teachings",
  },
  {
    icon: Map,
    title: "Pilgrimage Tours",
    description:
      "Explore sacred sites in Nepal, India, and beyond with expert guidance.",
    link: "/tours",
  },
  {
    icon: Heart,
    title: "Rituals and Ceremonies",
    description:
      "Support for birth, marriage, and funeral ceremonies with Buddhist traditions.",
    link: "/events",
  },
  {
    icon: Users,
    title: "Community Services",
    description:
      "Relief distribution, social services, and spiritual counseling.",
    link: "/programs",
  },
];

const ServicesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          Our Services
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                variants={itemVariants}
              >
                <IconComponent className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link
                  to={service.link}
                  className="text-red-600 hover:text-red-700 font-medium inline-flex items-center group"
                >
                  Learn More
                  <motion.svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </motion.svg>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
