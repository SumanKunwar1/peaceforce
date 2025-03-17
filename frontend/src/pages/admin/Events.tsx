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
import AdminLayout from "../../components/admin/AdminLayout";
import { useEvents, deleteEvent } from "@/lib/api";
import type { Event } from "@/types/event";
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
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

const Events: React.FC = () => {
  const navigate = useNavigate();
  const { events, isLoading, isError, mutate } = useEvents();
  const { toast } = useToast();
  const [tableData, setTableData] = useState<Event[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [seoMeta, setSeoMeta] = useState({
    _id: "",
    pageTitle: "teachings",
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
          pageTitle: fetchedData.pageTitle || "events",
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
    if (events) {
      setTableData(events);
    }
  }, [events]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEventToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete);
        await mutate();
        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted.",
          duration: 4000,
        });
      } catch (error) {
        console.error("Error deleting event:", error);
        toast({
          title: "Error",
          description: "Failed to delete event. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
    setIsDeleteAlertOpen(false);
    setEventToDelete(null);
  };

  const columns: ColumnDef<Event>[] = [
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
            src={
              typeof row.original.image === "string"
                ? row.original.image
                : "/placeholder.svg"
            }
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
      accessorKey: "registrations",
      header: "Registrations",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>{row.getValue("registrations") || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
          {row.getValue("status") || "Active"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;

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
                  setSelectedEvent(event);
                  setIsDialogOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/admin/events/edit/${event.id}`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteEvent(event.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tableData,
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

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (isError) return <div>Error loading events</div>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Events
          </motion.h1>
          <motion.button
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/events/add-new-event")}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Event
          </motion.button>
        </div>

        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter events..."
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
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  {selectedEvent.shortDescription}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <p>
                  <strong>Date:</strong> {selectedEvent.date || "TBD"}
                </p>
                <p>
                  <strong>Time:</strong> {selectedEvent.time || "TBD"}
                </p>
                <p>
                  <strong>Location:</strong> {selectedEvent.location}
                </p>
                <p>
                  <strong>Venue:</strong> {selectedEvent.venue}
                </p>
                <p>
                  <strong>Artist:</strong> {selectedEvent.artist}
                </p>
                <p className="mt-2">{selectedEvent.fullDescription}</p>
              </div>

              {selectedEvent.ticketTypes.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Tickets</h3>
                  <ul>
                    {selectedEvent.ticketTypes.map((ticket, index) => (
                      <li key={index} className="mt-1">
                        <strong>{ticket.type}</strong>: ${ticket.price} -{" "}
                        {ticket.available} available
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedEvent.gallery.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Gallery</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedEvent.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={(image as string) || "/placeholder.svg"}
                        alt={`Event ${selectedEvent.title} - ${index + 1}`}
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Events;
