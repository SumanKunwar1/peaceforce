"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Heart, Globe, Plus } from "lucide-react";
import type { ISupport } from "@/types/support";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImpactSectionProps {
  impacts: ISupport["impacts"];
  onChange: (impacts: ISupport["impacts"]) => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  Users,
  BookOpen,
  Heart,
  Globe,
};

const ImpactSection: React.FC<ImpactSectionProps> = ({
  impacts = [],
  onChange,
}) => {
  const [newImpact, setNewImpact] = useState({
    icon: "Users",
    number: "",
    title: "",
    description: "",
  });

  const handleChange = (index: number, field: string, value: string) => {
    const updatedImpacts = impacts.map((impact, i) =>
      i === index ? { ...impact, [field]: value } : impact
    );
    onChange(updatedImpacts);
  };

  const addImpact = () => {
    onChange([...impacts, newImpact]);
    setNewImpact({ icon: "Users", number: "", title: "", description: "" });
  };

  const removeImpact = (index: number) => {
    onChange(impacts.filter((_, i) => i !== index));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-gray-600">
            Your support helps us make a difference
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => {
            const IconComponent =
              iconMap[impact.icon as keyof typeof iconMap] || Users;
            return (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.1 }}
              >
                <IconComponent className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <Select
                  value={impact.icon}
                  onValueChange={(value) => handleChange(index, "icon", value)}
                >
                  <SelectTrigger className="w-full mb-2">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(iconMap).map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={impact.number}
                  onChange={(e) =>
                    handleChange(index, "number", e.target.value)
                  }
                  className="text-3xl font-bold text-red-600 mb-2 w-full text-center"
                  placeholder="Enter number"
                />
                <Input
                  value={impact.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  className="text-xl font-semibold mb-2 w-full text-center"
                  placeholder="Enter title"
                />
                <Textarea
                  value={impact.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  className="text-gray-600 w-full text-center"
                  placeholder="Enter description"
                />
                <Button
                  onClick={() => removeImpact(index)}
                  variant="destructive"
                  className="mt-2"
                >
                  Remove
                </Button>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-600 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Impact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Impact</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Select
                  value={newImpact.icon}
                  onValueChange={(value) =>
                    setNewImpact({ ...newImpact, icon: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(iconMap).map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newImpact.number}
                  onChange={(e) =>
                    setNewImpact({ ...newImpact, number: e.target.value })
                  }
                  placeholder="Enter number"
                />
                <Input
                  value={newImpact.title}
                  onChange={(e) =>
                    setNewImpact({ ...newImpact, title: e.target.value })
                  }
                  placeholder="Enter title"
                />
                <Textarea
                  value={newImpact.description}
                  onChange={(e) =>
                    setNewImpact({ ...newImpact, description: e.target.value })
                  }
                  placeholder="Enter description"
                />
              </div>
              <Button onClick={addImpact}>Add Impact</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
