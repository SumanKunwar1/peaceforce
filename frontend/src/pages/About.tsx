import { useEffect, useState } from "react";
import { aboutApi } from "@/lib/aboutApi";
import { IAbout } from "@/types/about";
import AboutHero from "@/components/about/AboutHero";
import AboutContent from "@/components/about/AboutContent";
import AboutMission from "@/components/about/AboutMission";
import AboutServices from "@/components/about/AboutServices";
import AboutVision from "@/components/about/AboutVision";
import Loader from "@/components/Loader";

const About = () => {
  const [aboutData, setAboutData] = useState<IAbout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await aboutApi.getAbout();
        setAboutData(data.about[0]);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch about data");
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!aboutData) return <div>No data available</div>;

  return (
    <div className="space-y-4">
      <AboutHero aboutHero={aboutData.aboutHero} />
      <AboutContent
        aboutContent={aboutData.aboutContent}
        image={aboutData.image as string}
      />
      <AboutMission missionsSection={aboutData.missionsSection} />
      <AboutServices servicesSection={aboutData.servicesSection} />
      <div className="bg-green-100 py-0 px-0">
        <div className=" max-w-7xl mx-auto text-white">
          <div>
            <AboutVision visionSection={aboutData.visionSection} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
