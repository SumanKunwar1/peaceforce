import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The meditation retreat at BTMC transformed my life. The serene environment and insightful teachings are unmatched.",
    author: "Sarah Chen",
    role: "Meditation Practitioner",
  },
  {
    quote:
      "The pilgrimage tour was incredibly well organized. The teachings at each sacred site added deep meaning to our journey.",
    author: "John Smith",
    role: "Pilgrimage Participant",
  },
  {
    quote:
      "BTMC's Buddhist philosophy courses have given me a new perspective on life and helped me find inner peace.",
    author: "Raj Sharma",
    role: "Philosophy Student",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      className="py-16 bg-gray-50"
      contentEditable
      suppressContentEditableWarning
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Students Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <Quote className="w-8 h-8 text-red-600 mb-4" />
              <p className="text-gray-700 mb-4">{testimonial.quote}</p>
              <div className="border-t pt-4">
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-gray-600 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
