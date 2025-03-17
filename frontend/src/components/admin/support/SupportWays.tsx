"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Heart, Users, DollarSign, Plus } from "lucide-react";
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

interface SupportWaysProps {
  waysToSupport: ISupport["waysToSupport"];
  onChange: (waysToSupport: ISupport["waysToSupport"]) => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  BookOpen,
  Heart,
  Users,
  DollarSign,
};

const SupportWays: React.FC<SupportWaysProps> = ({
  waysToSupport = [],
  onChange,
}) => {
  const [newWay, setNewWay] = useState({
    icon: "BookOpen",
    title: "",
    description: "",
    fullDescription: "",
    benefits: [],
  });
  const [editingWay, setEditingWay] = useState<number | null>(null);
  console.assert(editingWay);
  const handleChange = (index: number, field: string, value: string) => {
    const updatedWays = waysToSupport.map((way, i) =>
      i === index ? { ...way, [field]: value } : way
    );
    onChange(updatedWays);
  };

  const addWay = () => {
    onChange([...waysToSupport, newWay]);
    setNewWay({
      icon: "BookOpen",
      title: "",
      description: "",
      fullDescription: "",
      benefits: [],
    });
  };

  const removeWay = (index: number) => {
    onChange(waysToSupport.filter((_, i) => i !== index));
  };

  const handleBenefitChange = (
    index: number,
    benefitIndex: number,
    value: string
  ) => {
    const updatedWays = waysToSupport.map((way, i) =>
      i === index
        ? {
            ...way,
            benefits: way.benefits.map((benefit, j) =>
              j === benefitIndex ? value : benefit
            ),
          }
        : way
    );
    onChange(updatedWays);
  };

  const addBenefit = (index: number) => {
    const updatedWays = waysToSupport.map((way, i) =>
      i === index ? { ...way, benefits: [...way.benefits, ""] } : way
    );
    onChange(updatedWays);
  };

  const removeBenefit = (index: number, benefitIndex: number) => {
    const updatedWays = waysToSupport.map((way, i) =>
      i === index
        ? {
            ...way,
            benefits: way.benefits.filter((_, j) => j !== benefitIndex),
          }
        : way
    );
    onChange(updatedWays);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
        >
          <h2 className="text-3xl font-bold mb-4">Ways to Support</h2>
          <p className="text-gray-600">
            Choose how you'd like to contribute to our mission
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {waysToSupport.map((way, index) => {
            const IconComponent =
              iconMap[way.icon as keyof typeof iconMap] || BookOpen;
            return (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: index * 0.1 }}
              >
                <IconComponent className="w-12 h-12 text-red-600 mb-4" />
                <Select
                  value={way.icon}
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
                  value={way.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  className="text-xl font-semibold mb-2 w-full"
                  placeholder="Enter title"
                />
                <Textarea
                  value={way.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  className="text-gray-600 w-full mb-2"
                  placeholder="Enter description"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingWay(index)}
                      className="mt-4 text-red-600 font-semibold hover:text-red-700 transition-colors"
                    >
                      Edit Full Description
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Full Description</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Textarea
                        value={way.fullDescription}
                        onChange={(e) =>
                          handleChange(index, "fullDescription", e.target.value)
                        }
                        placeholder="Enter full description"
                      />
                      <h4 className="font-semibold">Benefits</h4>
                      {way.benefits.map((benefit, benefitIndex) => (
                        <div
                          key={benefitIndex}
                          className="flex items-center gap-2"
                        >
                          <Input
                            value={benefit}
                            onChange={(e) =>
                              handleBenefitChange(
                                index,
                                benefitIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Benefit ${benefitIndex + 1}`}
                          />
                          <Button
                            onClick={() => removeBenefit(index, benefitIndex)}
                            variant="destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button onClick={() => addBenefit(index)}>
                        Add Benefit
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => removeWay(index)}
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
                <Plus className="mr-2 h-4 w-4" /> Add Way to Support
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Way to Support</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Select
                  value={newWay.icon}
                  onValueChange={(value) =>
                    setNewWay({ ...newWay, icon: value })
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
                  value={newWay.title}
                  onChange={(e) =>
                    setNewWay({ ...newWay, title: e.target.value })
                  }
                  placeholder="Enter title"
                />
                <Textarea
                  value={newWay.description}
                  onChange={(e) =>
                    setNewWay({ ...newWay, description: e.target.value })
                  }
                  placeholder="Enter description"
                />
                <Textarea
                  value={newWay.fullDescription}
                  onChange={(e) =>
                    setNewWay({ ...newWay, fullDescription: e.target.value })
                  }
                  placeholder="Enter full description"
                />
              </div>
              <Button onClick={addWay}>Add Way to Support</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default SupportWays;
