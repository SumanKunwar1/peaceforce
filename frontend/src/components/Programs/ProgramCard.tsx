import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { IProgram } from "../../types/program";

interface ProgramCardProps {
  program: IProgram;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden flex-1 min-w-[300px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={program?.image as string | undefined}
        alt={program?.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{program?.title}</h3>
        <p className="text-gray-600 mb-4">{program?.shortDescription}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-green-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{new Date(program?.startDate).toLocaleDateString()}</span>
          </div>
          <Link
            to={`/programs/${program?.id}`}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgramCard;
