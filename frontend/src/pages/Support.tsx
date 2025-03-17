import { useState, useEffect } from "react";
import { supportApi } from "@/lib/supportApi";
import { ISupport } from "../types/support";
import SupportHero from "@/components/support/SupportHero";
import DonationSection from "@/components/support/DonationSection";
import ImpactSection from "@/components/support/ImpactSection";
import SupportWays from "@/components/support/SupportWays";

export default function SupportPage() {
  const [supportData, setSupportData] = useState<ISupport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { support } = await supportApi.getSupport();
        setSupportData(support);
      } catch (err) {
        setError("Failed to fetch support data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!supportData) return <div>No data available</div>;

  return (
    <div>
      <SupportHero heroData={supportData.hero} />
      <DonationSection heroImage={supportData.hero.image} />
      <ImpactSection impacts={supportData.impacts} />
      <SupportWays waysToSupport={supportData.waysToSupport} />
    </div>
  );
}
