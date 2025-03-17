import HeroSection from "../components/home/HeroSection";
import BriefAboutSection from "../components/home/BriefAboutSection";
import ServicesSection from "../components/home/ServiceSection";
import EventsSection from "../components/home/ProgramsSection";
import TestimonialsSection from "../components/home/TestimonialSection";
import StatsSection from "../components/home/StatSection";
import LocationSection from "../components/home/LocationSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <BriefAboutSection />
      <ServicesSection />
      <EventsSection />
      <TestimonialsSection />
      <StatsSection />
      <LocationSection />
    </div>
  );
};

export default Home;
