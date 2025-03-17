"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { IProgram } from "@/types/program";
import { usePrograms } from "@/lib/api";
import Loader from "@/components/Loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
const Programs: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedProgram, setSelectedProgram] = useState<IProgram | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState<boolean>(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);
  const { programs: fetchedPrograms } = usePrograms();
  const { toast } = useToast();

  const [seoMeta, setSeoMeta] = useState({
    _id: "",
    pageTitle: "programs",
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
          pageTitle: fetchedData.pageTitle || "programs",
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
    if (fetchedPrograms) {
      setPrograms(fetchedPrograms);
      setIsLoading(false);
    }
  }, [fetchedPrograms]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProgram(null);
  };

  const columns: ColumnDef<IProgram>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center">
          <img
            src={row.original?.image as string | undefined}
            alt={row.getValue("title")}
            className="w-10 h-10 rounded-lg object-cover mr-3"
          />
          <div>
            <p className="font-medium">{row.getValue("title")}</p>
            <p className="text-sm text-gray-500">
              {row.original.shortDescription}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {row.getValue("date")}
            <br />
            {row.original.time}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "venue",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{row.getValue("venue")}</span>
        </div>
      ),
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>{row.getValue("capacity")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const program = row.original;

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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProgram(program);
                  setIsDialogOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/admin/programs/edit/${program.id}`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteProgram(program.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: programs,
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

  const handleDeleteProgram = (id: string) => {
    setProgramToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteProgram = async () => {
    if (programToDelete) {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("adminToken");

        // Check if the token exists
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        // Make the DELETE request with authentication
        await axios.delete(`/api/program/${programToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Adding the token to the header
          },
        });

        // Update state after successful deletion
        setPrograms(
          programs.filter((program) => program.id !== programToDelete)
        );
        setIsDeleteAlertOpen(false);
        setProgramToDelete(null);
      } catch (error) {
        console.error("Error deleting program:", error);
      }
    }
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Programs
          </motion.h1>
          <motion.button
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/programs/add-new-program")}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Program
          </motion.button>
        </div>

        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter programs..."
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
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
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg">
          {selectedProgram && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProgram.title}</DialogTitle>
                <DialogDescription>
                  {selectedProgram.shortDescription}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <p>
                  <strong>Start Date:</strong>{" "}
                  {selectedProgram.startDate || "TBD"}
                </p>
                <p>
                  <strong>End Date:</strong> {selectedProgram.endDate || "TBD"}
                </p>
                <p>
                  <strong>Time:</strong> {selectedProgram.time || "TBD"}
                </p>
                <p>
                  <strong>Location:</strong> {selectedProgram.location}
                </p>
                <p>
                  <strong>Venue:</strong> {selectedProgram.venue}
                </p>
                <p>
                  <strong>Instructor:</strong> {selectedProgram.instructor}
                </p>
                <p className="mt-2">{selectedProgram.fullDescription}</p>
              </div>

              {selectedProgram.ticketTypes && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Tickets</h3>
                  <p>{selectedProgram.ticketTypes}</p>
                </div>
              )}

              {selectedProgram.gallery &&
                selectedProgram.gallery.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Gallery</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProgram.gallery.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Program ${selectedProgram.title} - ${
                            index + 1
                          }`}
                          className="w-full h-32 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}

              <DialogFooter>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
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

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              program and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProgram}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Programs;
