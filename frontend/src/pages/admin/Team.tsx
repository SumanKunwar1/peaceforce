"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  getTeamMembers,
  deleteTeamMember,
  updateTeamMember,
} from "@/lib/teams";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/components/admin/AdminLayout";
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
import type { ITeamData } from "@/types/team";
import axios from "axios";

const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<ITeamData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedMember, setSelectedMember] = useState<ITeamData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ITeamData>>({
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
    },
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { toast } = useToast();
  const [seoMeta, setSeoMeta] = useState({
    _id: "",
    pageTitle: "team",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  useEffect(() => {
    const fetchSeoMeta = async () => {
      try {
        const response = await axios.get(
          `/api/global-meta/${seoMeta.pageTitle}`
        );
        const fetchedData = response.data.seoMeta;

        // Ensure the response includes pageTitle, metaTitle, etc.
        setSeoMeta({
          _id: fetchedData._id || "",
          pageTitle: fetchedData.pageTitle || "team",
          metaTitle: fetchedData.metaTitle || "",
          metaDescription: fetchedData.metaDescription || "",
          metaKeywords: fetchedData.metaKeywords || "",
        });
      } catch (error) {
        console.error("Error fetching SEO metadata:", error);
      }
    };

    fetchSeoMeta();
  }, [seoMeta.pageTitle]);
  const handleSeoMetaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSeoMeta({ ...seoMeta, [e.target.name]: e.target.value });
  };

  const handleSeoMetaSubmit = async () => {
    try {
      // Prepare the data for submission
      const seoData = {
        pageTitle: seoMeta.pageTitle,
        metaTitle: seoMeta.metaTitle,
        metaDescription: seoMeta.metaDescription,
        metaKeywords:
          typeof seoMeta.metaKeywords === "string"
            ? seoMeta.metaKeywords.split(",").map((keyword) => keyword.trim())
            : [],
      };

      const method = seoMeta._id ? "patch" : "post";
      const url = seoMeta._id
        ? `/api/global-meta/${seoMeta._id}`
        : "/api/global-meta";

      // Make the request (either POST or PATCH)
      await axios[method](url, seoData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast({
        title: "SEO Metadata Updated",
        description: "The SEO metadata has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating SEO metadata:", error);
      toast({
        title: "Error",
        description: "Failed to update SEO metadata. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const fetchedMembers = await getTeamMembers();
      setTeamMembers(fetchedMembers.teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch team members. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sanitizeFormData = (data: Partial<ITeamData>) => {
    const { _id, createdAt, updatedAt, __v, id, ...sanitizedData } = data;
    return sanitizedData;
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      await deleteTeamMember(memberId);
      toast({
        title: "Success",
        description: "Team member deleted successfully.",
      });
      fetchTeamMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description: "Failed to delete team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewMember = (member: ITeamData) => {
    setSelectedMember(member);
    setIsViewDialogOpen(true);
  };

  const handleEditMember = (member: ITeamData) => {
    setSelectedMember(member);
    setEditForm({
      name: member.name,
      role: member.role,
      image: member.image,
      bio: member.bio,
      socialLinks: {
        instagram: member.socialLinks?.instagram || "",
        facebook: member.socialLinks?.facebook || "",
        twitter: member.socialLinks?.twitter || "",
        linkedin: member.socialLinks?.linkedin || "",
      },
    });
    setImagePreview(member.image as string);
    setIsEditDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Assuming setImagePreview expects a string (Base64 URL)
        setImagePreview(reader.result as string); // Base64 string for preview
        setEditForm((prev) => ({
          ...prev,
          image: file, // Set the file object in the form state
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;

    try {
      const sanitizedData = sanitizeFormData(editForm);
      const formData = new FormData();

      Object.entries(sanitizedData).forEach(([key, value]) => {
        if (key === "socialLinks") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "image" && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });

      await updateTeamMember(selectedMember.id, formData);
      toast({
        title: "Success",
        description: "Team member updated successfully.",
      });
      setIsEditDialogOpen(false);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error updating team member:", error);
      toast({
        title: "Error",
        description: "Failed to update team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<ITeamData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        const image = row.original.image;
        return (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <img
                src={
                  image instanceof File
                    ? URL.createObjectURL(image) // Convert file to object URL
                    : image || "/placeholder.svg" // Fallback to URL or placeholder
                }
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <Briefcase className="w-4 h-4 mr-2" />
          <span>{row.getValue("role")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewMember(member)}>
                <Users className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditMember(member)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the team member.
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: teamMembers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-2xl font-bold flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Users className="w-6 h-6 mr-2" /> Team Management
          </motion.h1>
          <Button onClick={() => (window.location.href = "/admin/add-team")}>
            Add New Member
          </Button>
        </div>

        {/* Search and Table Section */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter team members..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </motion.div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Team Member Details</DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <span>
                      <img
                        src={
                          selectedMember.image instanceof File
                            ? URL.createObjectURL(selectedMember.image)
                            : selectedMember.image || "/placeholder.svg"
                        }
                        alt={selectedMember.name}
                        className="h-20 w-auto object-cover rounded-sm"
                      />
                    </span>
                  </div>
                  <span className="font-medium">
                    Name: {selectedMember.name}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>Role: {selectedMember.role}</span>
                </div>
                <div className="text-gray-600">
                  <span>Bio: {selectedMember.bio}</span>
                </div>
                <div className="text-gray-600">
                  <span>Social Links:</span>
                  <ul className="list-disc list-inside mt-2">
                    {Object.entries(selectedMember.socialLinks).map(
                      ([platform, link]) => (
                        <li key={platform}>
                          {platform}: {link}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Role</label>
                  <Input
                    value={editForm.role || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    placeholder="Enter role"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Bio</label>
                  <Textarea
                    value={editForm.bio || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    placeholder="Enter bio"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Image</label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-24 w-auto "
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="max-w-[200px]"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Social Links
                  </label>
                  <Input
                    value={editForm.socialLinks?.instagram || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        socialLinks: {
                          ...editForm.socialLinks,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder="Instagram URL"
                  />
                  <Input
                    value={editForm.socialLinks?.facebook || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        socialLinks: {
                          ...editForm.socialLinks,
                          facebook: e.target.value,
                        },
                      })
                    }
                    placeholder="Facebook URL"
                  />
                  <Input
                    value={editForm.socialLinks?.twitter || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        socialLinks: {
                          ...editForm.socialLinks,
                          twitter: e.target.value,
                        },
                      })
                    }
                    placeholder="Twitter URL"
                  />
                  <Input
                    value={editForm.socialLinks?.linkedin || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        socialLinks: {
                          ...editForm.socialLinks,
                          linkedin: e.target.value,
                        },
                      })
                    }
                    placeholder="LinkedIn URL"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateMember}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mx-auto p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          SEO Meta Information
        </h2>

        <div className="mb-4">
          <label
            htmlFor="metaTitle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Meta Title
          </label>
          <Input
            type="text"
            id="metaTitle"
            name="metaTitle"
            value={seoMeta.metaTitle}
            onChange={handleSeoMetaChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter meta title"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Meta Description
          </label>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            value={seoMeta.metaDescription}
            onChange={handleSeoMetaChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter meta description"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="metaKeywords"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Meta Keywords
          </label>
          <Input
            type="text"
            id="metaKeywords"
            name="metaKeywords"
            value={seoMeta.metaKeywords}
            onChange={handleSeoMetaChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Enter keywords (comma-separated)"
          />
        </div>

        <Button onClick={handleSeoMetaSubmit}>Update SEO Metadata</Button>
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;
