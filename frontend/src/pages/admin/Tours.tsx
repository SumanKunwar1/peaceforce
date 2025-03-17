"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Map,
  Calendar,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tour } from "@/types/tour";
import { useNavigate } from "react-router-dom";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { getTours, deleteTour } from "@/lib/toursApi";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

const Tours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<string | null>(null);
  const [seoMeta, setSeoMeta] = useState({
    _id: "",
    pageTitle: "tours",
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
          pageTitle: fetchedData.pageTitle || "tours",
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
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const fetchedTours = await getTours();
      setTours(fetchedTours);
    } catch (error) {
      console.error("Error fetching tours:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tours data",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTour = (tourId: string) => {
    setTourToDelete(tourId);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteTour = async () => {
    if (tourToDelete) {
      try {
        await deleteTour(tourToDelete);
        setTours(tours.filter((tour) => tour.id !== tourToDelete));
        toast({
          title: "Success",
          description: "Tour item deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting tour:", error);
        toast({
          title: "Error",
          description: "Failed to delete tour. Please try again.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteAlertOpen(false);
    setTourToDelete(null);
  };

  const columns: ColumnDef<Tour>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tour
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div>
          <Calendar className="inline w-5 h-5 mr-2" />
          {row.getValue("duration")} days
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={
              status === "Upcoming"
                ? "text-yellow-500"
                : status === "Ongoing"
                ? "text-green-500"
                : status === "Completed"
                ? "text-gray-500"
                : status === "Cancelled"
                ? "text-red-500"
                : ""
            }
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const tour = row.original;

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
                onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>View/Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteTour(tour.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tours,
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
            <Map className="w-6 h-6 mr-2" /> Tours
          </motion.h1>
          <motion.button
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/tours/add-new-page")}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Tour
          </motion.button>
        </div>

        {/* Search and Table Section */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter tours..."
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              tour and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTour}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Tours;
