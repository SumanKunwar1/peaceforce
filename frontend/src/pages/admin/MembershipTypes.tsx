"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  getMemberships,
  createMembership,
  updateMembership,
  deleteMembership,
} from "@/lib/membershipApi";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface IMembershipTypes {
  id: string;
  name: string;
  duration: string;
  fee: number;
  benefits: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

const MembershipTypes: React.FC = () => {
  const [memberships, setMemberships] = useState<IMembershipTypes[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] =
    useState<IMembershipTypes | null>(null);
  const [formData, setFormData] = useState<Omit<IMembershipTypes, "id">>({
    name: "",
    duration: "",
    fee: 0,
    benefits: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const fetchedMemberships = await getMemberships();
      setMemberships(fetchedMemberships.memberships);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      toast({
        title: "Error",
        description: "Failed to fetch memberships. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddMembership = async () => {
    try {
      await createMembership(formData);
      toast({
        title: "Success",
        description: "Membership added successfully.",
      });
      setIsAddDialogOpen(false);
      fetchMemberships();
    } catch (error) {
      console.error("Error adding membership:", error);
      toast({
        title: "Error",
        description: "Failed to add membership. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditMembership = (membership: IMembershipTypes) => {
    setSelectedMembership(membership);
    setFormData({
      name: membership.name,
      duration: membership.duration,
      fee: membership.fee,
      benefits: membership.benefits,
      metaTitle: membership.metaTitle || "",
      metaDescription: membership.metaDescription || "",
      metaKeywords: membership.metaKeywords || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMembership = async () => {
    if (!selectedMembership) return;

    try {
      await updateMembership(selectedMembership.id, formData);
      toast({
        title: "Success",
        description: "Membership updated successfully.",
      });
      setIsEditDialogOpen(false);
      fetchMemberships();
    } catch (error) {
      console.error("Error updating membership:", error);
      toast({
        title: "Error",
        description: "Failed to update membership. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMembership = async (id: string) => {
    try {
      await deleteMembership(id);
      toast({
        title: "Success",
        description: "Membership deleted successfully.",
      });
      fetchMemberships();
    } catch (error) {
      console.error("Error deleting membership:", error);
      toast({
        title: "Error",
        description: "Failed to delete membership. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Membership Types</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Membership Type
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memberships.map((membership) => (
          <Card key={membership.id}>
            <CardHeader>
              <CardTitle>{membership.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Duration:</strong> {membership.duration}
              </p>
              <p>
                <strong>Fee:</strong> ${membership.fee}
              </p>
              <ul className="list-disc list-inside">
                {membership.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditMembership(membership)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteMembership(membership.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Membership Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter membership name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <Input
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="Enter duration (e.g., '1 month', '1 year', 'lifetime')"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fee</label>
              <Input
                type="number"
                value={formData.fee}
                onChange={(e) =>
                  setFormData({ ...formData, fee: Number(e.target.value) })
                }
                placeholder="Enter fee"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Benefits</label>
              <Textarea
                value={formData.benefits.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    benefits: e.target.value.split("\n"),
                  })
                }
                placeholder="Enter benefits (one per line)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <Input
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                placeholder="Enter meta title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <Textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metaDescription: e.target.value,
                  })
                }
                placeholder="Enter meta description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Keywords
              </label>
              <Input
                value={formData.metaKeywords?.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metaKeywords: e.target.value.split(", "),
                  })
                }
                placeholder="Enter meta keywords (comma-separated)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMembership}>Add Membership</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Membership Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter membership name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <Input
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="Enter duration (e.g., '1 month', '1 year', 'lifetime')"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fee</label>
              <Input
                type="number"
                value={formData.fee}
                onChange={(e) =>
                  setFormData({ ...formData, fee: Number(e.target.value) })
                }
                placeholder="Enter fee"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Benefits</label>
              <Textarea
                value={formData.benefits.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    benefits: e.target.value.split("\n"),
                  })
                }
                placeholder="Enter benefits (one per line)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <Input
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                placeholder="Enter meta title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <Textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metaDescription: e.target.value,
                  })
                }
                placeholder="Enter meta description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Keywords
              </label>
              <Input
                value={formData.metaKeywords?.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metaKeywords: e.target.value.split(", "),
                  })
                }
                placeholder="Enter meta keywords (comma-separated)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateMembership}>Update Membership</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MembershipTypes;
