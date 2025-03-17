const features = [
  {
    title: "Buddhist Teachings",
    description:
      "Learn authentic Buddhist philosophy and practices from experienced teachers",
  },
  {
    title: "Meditation Courses",
    description:
      "Join our meditation sessions for inner peace and spiritual growth",
  },
  {
    title: "Pilgrimage Tours",
    description: "Experience sacred Buddhist sites with knowledgeable guides",
  },
];

const FeaturesSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="text-center p-6 bg-white rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
