import { Link } from "react-router-dom";

const HeroButtons = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <Link
        to="/teachings"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Enroll in a Course
      </Link>
      <Link
        to="/tours"
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Join Pilgrimage Tour
      </Link>
      <Link
        to="/support"
        className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg transition-colors"
      >
        Donate Now
      </Link>
    </div>
  );
};

export default HeroButtons;
