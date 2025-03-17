"use client";

import React, { useState, useEffect } from "react";
import { supportApi } from "@/lib/supportApi";
import { ISupport, ISupportInput } from "@/types/support";
import SupportHero from "@/components/admin/support/SupportHero";
import DonationSection from "@/components/admin/support/DonationSection";
import ImpactSection from "@/components/admin/support/ImpactSection";
import SupportWays from "@/components/admin/support/SupportWays";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Support: React.FC = () => {
  const [supportData, setSupportData] = useState<ISupport | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const data = await supportApi.getSupport();
        setSupportData(data.support);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch support data:", err);
        setLoading(false);
        // If there's no data, we'll just show the empty form
        setSupportData(null);
      }
    };

    fetchSupportData();
  }, []);
  console.log("supportData", supportData);

  const sanitizeData = (data: ISupport): FormData => {
    const { _id, id, createdAt, updatedAt, __v, ...sanitizedData } = data;

    const sanitizeNestedObject = (obj: any) => {
      const { _id, id, image, ...rest } = obj;
      return rest;
    };

    // Create FormData for file upload
    const formData = new FormData();

    // Add the hero image if it's a File object
    if (sanitizedData.hero.image instanceof File) {
      formData.append("image", sanitizedData.hero.image);
    }

    // Add the other data as JSON
    formData.append(
      "impacts",
      JSON.stringify(sanitizedData.impacts?.map(sanitizeNestedObject) ?? [])
    );
    formData.append(
      "waysToSupport",
      JSON.stringify(
        sanitizedData.waysToSupport?.map(sanitizeNestedObject) ?? []
      )
    );

    return formData;
  };

  const handleSaveChanges = async () => {
    if (!supportData) return;
    try {
      const formData = sanitizeData(supportData);
      const updatedData = await supportApi.updateSupport(
        formData as ISupportInput
      );
      setSupportData(updatedData);
      toast({
        title: "Success",
        description: "Support data updated successfully.",
      });
    } catch (err) {
      console.error("Error updating support data:", err);
      toast({
        title: "Error",
        description: "Failed to update support data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof ISupport, value: any) => {
    setSupportData((prev) => {
      if (!prev) {
        // If there's no previous data, create a new object
        return { [field]: value } as ISupport;
      }
      return { ...prev, [field]: value };
    });
  };

  if (loading) return <div>Loading...</div>;

  const emptySupport: ISupport = {
    hero: { title: "", subtitle: "", image: "" },
    impacts: [],
    waysToSupport: [],
  };

  const currentData = supportData || emptySupport;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="space-y-8">
        <SupportHero
          hero={currentData.hero}
          onChange={(hero) => handleChange("hero", hero)}
          onFileChange={(file) =>
            handleChange("hero", { ...currentData.hero, image: file })
          }
        />
        <DonationSection heroImage={currentData.hero.image} />
        <ImpactSection
          impacts={currentData.impacts}
          onChange={(impacts) => handleChange("impacts", impacts)}
        />
        <SupportWays
          waysToSupport={currentData.waysToSupport}
          onChange={(ways) => handleChange("waysToSupport", ways)}
        />
      </div>

      <div className="flex justify-center my-6">
        <Button
          onClick={handleSaveChanges}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {supportData ? "Save Changes" : "Create Support Data"}
        </Button>
      </div>
    </div>
  );
};

export default Support;
