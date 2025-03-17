import { motion } from "framer-motion";
import { User, Calendar, Map } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "enrollment",
    user: "John Doe",
    action: "enrolled in",
    target: "Buddhist Philosophy 101",
    time: "2 hours ago",
    icon: User,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    type: "event",
    user: "Sarah Smith",
    action: "registered for",
    target: "Meditation Retreat",
    time: "4 hours ago",
    icon: Calendar,
    color: "bg-red-100 text-red-600",
  },
  {
    id: 3,
    type: "tour",
    user: "Mike Johnson",
    action: "booked",
    target: "Tibet Pilgrimage Tour",
    time: "6 hours ago",
    icon: Map,
    color: "bg-green-100 text-green-600",
  },
];

const RecentActivities = () => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  {activity.user}
                </span>{" "}
                {activity.action}{" "}
                <span className="font-medium text-gray-900">
                  {activity.target}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm text-red-600 hover:text-red-700">
        View all activities →
      </button>
    </motion.div>
  );
};

export default RecentActivities;
