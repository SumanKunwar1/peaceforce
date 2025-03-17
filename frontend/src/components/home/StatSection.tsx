import { useEffect, useState } from "react";
import { Clock, Users, Map } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Clock,
    endValue: 21,
    suffix: "+",
    label: "Years of Experience",
    description: "in Buddhist Education",
  },
  {
    icon: Users,
    endValue: 5000,
    suffix: "+",
    label: "Students Trained",
    description: "from around the world",
  },
  {
    icon: Map,
    endValue: 300,
    suffix: "+",
    label: "Pilgrimage Tours",
    description: "successfully organized",
  },
];

interface CountUpProps {
  end: number;
  suffix?: string;
}

const CountUp = ({ end, suffix = "" }: CountUpProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 3000; // 4 seconds
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  const [renderKey, setRenderKey] = useState(0);

  return (
    <section className="bg-green-600 py-16 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                onViewportEnter={() => setRenderKey((prev) => prev + 1)} // Force re-render
                viewport={{ once: false }} // Allow retriggering on every scroll
                transition={{ duration: 0.5 }}
              >
                <IconComponent className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <div className="text-4xl font-bold mb-2">
                  <CountUp
                    key={renderKey + index}
                    end={stat.endValue}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-xl font-semibold mb-1">{stat.label}</div>
                <div className="text-green-100">{stat.description}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
