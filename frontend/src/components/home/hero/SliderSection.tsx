"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "@/components/Loader";

interface SliderButton {
  text: string;
  link: string;
  bgColor: string;
  _id: string;
}

interface Slider {
  _id: string;
  title: string;
  description: string;
  image: string;
  buttons: SliderButton[];
  isVisible: boolean;
}

const SliderSection: React.FC = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await axios.get<{ sliders: Slider[] }>("/api/slider", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setSliders(response.data.sliders.filter((slider) => slider.isVisible));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sliders:", error);
      setError("Failed to load sliders. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sliders.length > 0) {
      const timer = setInterval(() => {
        setCurrentSliderIndex((prevIndex) =>
          prevIndex === sliders.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change slider every 5 seconds

      return () => clearInterval(timer);
    }
  }, [sliders]);

  if (isLoading) {
    <div>
      <Loader />
    </div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (sliders.length === 0) {
    return null; // Don't render anything if there are no visible sliders
  }

  const currentSlider = sliders[currentSliderIndex];

  return (
    <section className="relative h-[600px] items-center">
      <div className="absolute inset-0">
        <img
          src={`${currentSlider.image}`}
          alt={currentSlider.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {currentSlider.title}
          </h1>
          <p className="text-xl mb-8">{currentSlider.description}</p>
          <div className="flex flex-wrap gap-4">
            {currentSlider.buttons.map((button) => (
              <Link
                key={button._id}
                to={button.link}
                className="px-6 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: button.bgColor }}
              >
                {button.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SliderSection;
