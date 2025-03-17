"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/types/testimonials";
import { getTestimonials } from "@/lib/testimonials";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const fetchedTestimonials = await getTestimonials();
        setTestimonials(fetchedTestimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, [toast]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Students Say
        </h2>
        <div className="relative w-full max-w-5xl mx-auto">
          {/* Carousel */}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="sm:basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="h-full">
                      <CardContent className="flex flex-col  justify-start p-6">
                        <Quote className="w-8 h-8 text-red-600 mb-4" />
                        <p className="text-gray-700 mb-4 ">
                          {testimonial.quote}
                        </p>
                        <div className="border-t pt-4">
                          <div className="font-semibold">
                            {testimonial.author}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {testimonial.role}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <CarouselPrevious className="absolute left-2 sm:left-full top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 sm:p-1" />
            <CarouselNext className="absolute right-2 sm:right-full top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 sm:p-1" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
