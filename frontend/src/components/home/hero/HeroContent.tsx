import HeroButtons from "./HeroButton";

const HeroContent = () => {
  return (
    <div className="text-white max-w-2xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Promoting Peace, Wisdom, and Compassion
      </h1>
      <p className="text-xl mb-8">Through Buddhist Teachings and Meditation</p>
      <HeroButtons />
    </div>
  );
};

export default HeroContent;
