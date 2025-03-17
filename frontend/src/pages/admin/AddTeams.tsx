/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Linkedin, Instagram, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/teams";
import type { ITeamData, ITeamInput } from "@/types/team";
import Loader from "@/components/Loader";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<ITeamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<ITeamData | null>(null);
  const navigate = useNavigate();
  const [newMember, setNewMember] = useState<ITeamInput>({
    name: "",
    role: "",
    bio: "",
    socialLinks: { instagram: "", facebook: "", twitter: "", linkedin: "" },
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const data = await getTeamMembers();
      setTeamMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch team members. Please try again.",
        variant: "destructive",
      });
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id?: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        if (id) {
          await updateTeamMember(id, formData);
          toast({
            title: "Success",
            description: "Team member image updated successfully.",
          });
        } else {
          setNewMember((prev) => ({ ...prev, image: file }));
        }
        fetchTeamMembers();
      } catch (error) {
        console.error("Failed to update image:", error);
        toast({
          title: "Error",
          description: "Failed to update image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddNewMember = async () => {
    try {
      const formData = new FormData();
      Object.entries(newMember).forEach(([key, value]) => {
        if (key === "socialLinks") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "image" && value instanceof File) {
          formData.append(key, value);
        } else if (key === "metaKeywords") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      await createTeamMember(formData);
      toast({
        title: "Success",
        description: "New team member added successfully.",
      });
      navigate("/admin/team");
      setNewMember({
        name: "",
        role: "",
        bio: "",
        socialLinks: { instagram: "", facebook: "", twitter: "", linkedin: "" },
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
      });
    } catch (error) {
      console.error("Failed to add new member:", error);
      toast({
        title: "Error",
        description: "Failed to add new member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    try {
      const formData = new FormData();
      Object.entries(editingMember).forEach(([key, value]) => {
        if (key === "socialLinks") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "image" && value instanceof File) {
          formData.append(key, value);
        } else if (key === "metaKeywords") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      await updateTeamMember(editingMember.id, formData);
      toast({
        title: "Success",
        description: "Team member updated successfully.",
      });
      fetchTeamMembers();
      setEditingMember(null);
    } catch (error) {
      console.error("Failed to update member:", error);
      toast({
        title: "Error",
        description: "Failed to update member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteTeamMember(id);
      toast({
        title: "Success",
        description: "Team member deleted successfully.",
      });
      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);
      toast({
        title: "Error",
        description: "Failed to delete member. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <motion.h1
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Team Members
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md p-6">
              <img
                src={
                  member.image instanceof File
                    ? URL.createObjectURL(member.image) // Convert file to object URL
                    : member.image || "/placeholder.svg" // Fallback to URL or placeholder
                }
                alt={member.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />

              <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
              <p className="text-gray-600 mb-2">{member.role}</p>
              <p className="text-sm text-gray-500 mb-4">{member.bio}</p>
              <div className="flex space-x-4 mb-4">
                {member.socialLinks.facebook && (
                  <a
                    href={member.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </a>
                )}
                {member.socialLinks.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5 text-blue-800" />
                  </a>
                )}
                {member.socialLinks.instagram && (
                  <a
                    href={member.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </a>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setEditingMember(member)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the team member.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4">Add New Team Member</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={newMember.role}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={newMember.bio}
                onChange={(e) =>
                  setNewMember({ ...newMember, bio: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                onChange={(e) => handleImageChange(e)}
                accept="image/*"
              />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={newMember.socialLinks?.facebook || ""}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    socialLinks: {
                      ...newMember.socialLinks,
                      facebook: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={newMember.socialLinks?.twitter || ""}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    socialLinks: {
                      ...newMember.socialLinks,
                      twitter: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={newMember.socialLinks?.linkedin || ""}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    socialLinks: {
                      ...newMember.socialLinks,
                      linkedin: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={newMember.socialLinks?.instagram || ""}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    socialLinks: {
                      ...newMember.socialLinks,
                      instagram: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={newMember.metaTitle}
                onChange={(e) =>
                  setNewMember({ ...newMember, metaTitle: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Input
                id="metaDescription"
                value={newMember.metaDescription}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    metaDescription: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="metaKeywords">
                Meta Keywords (comma-separated)
              </Label>
              <Input
                id="metaKeywords"
                value={newMember.metaKeywords?.join(", ")}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    metaKeywords: e.target.value
                      .split(",")
                      .map((keyword) => keyword.trim()),
                  })
                }
              />
            </div>
            <Button onClick={handleAddNewMember}>Add Team Member</Button>
          </div>
        </motion.div>

        {editingMember && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">Edit Team Member</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingMember.name}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Input
                    id="edit-role"
                    value={editingMember.role}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        role: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-bio">Bio</Label>
                  <Input
                    id="edit-bio"
                    value={editingMember.bio}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        bio: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="edit-image">Image</Label>
                  <Input
                    id="edit-image"
                    type="file"
                    onChange={(e) => handleImageChange(e, editingMember.id)}
                    accept="image/*"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-facebook">Facebook</Label>
                  <Input
                    id="edit-facebook"
                    value={editingMember.socialLinks?.facebook || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socialLinks: {
                          ...editingMember.socialLinks,
                          facebook: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-twitter">Twitter</Label>
                  <Input
                    id="edit-twitter"
                    type="url"
                    value={editingMember.socialLinks?.twitter || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socialLinks: {
                          ...editingMember.socialLinks,
                          twitter: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="edit-linkedin">LinkedIn</Label>
                  <Input
                    id="edit-linkedin"
                    value={editingMember.socialLinks?.linkedin || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socialLinks: {
                          ...editingMember.socialLinks,
                          linkedin: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-instagram">Instagram</Label>
                  <Input
                    id="edit-instagram"
                    value={editingMember.socialLinks?.instagram || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        socialLinks: {
                          ...editingMember.socialLinks,
                          instagram: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-metaTitle">Meta Title</Label>
                  <Input
                    id="edit-metaTitle"
                    value={editingMember.metaTitle}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        metaTitle: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-metaDescription">Meta Description</Label>
                  <Input
                    id="edit-metaDescription"
                    value={editingMember.metaDescription}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        metaDescription: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-metaKeywords">
                    Meta Keywords (comma-separated)
                  </Label>
                  <Input
                    id="edit-metaKeywords"
                    value={editingMember.metaKeywords?.join(", ")}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        metaKeywords: e.target.value
                          .split(",")
                          .map((keyword) => keyword.trim()),
                      })
                    }
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => setEditingMember(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateMember}>Save Changes</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Team;
