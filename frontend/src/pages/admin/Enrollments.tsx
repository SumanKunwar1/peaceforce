"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Phone,
  FileText,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
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
  deleteEnrollment,
  getEnrollments,
  updateEnrollment,
} from "@/lib/enrollment";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/components/admin/AdminLayout";

export interface Enrollment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    address: string;
    page: string;
    pageTitle: string;
    coverLetter: string;
  };
  preferredLanguage: string;
  message: string;
  courseId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

const Enrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<string | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    preferredLanguage: "",
    message: "",
    courseId: "",
    categoryId: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const fetchedEnrollments = await getEnrollments();
      setEnrollments(fetchedEnrollments.enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch enrollments. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEnrollment = (enrollmentId: string) => {
    setEnrollmentToDelete(enrollmentId);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteEnrollment = async () => {
    if (enrollmentToDelete) {
      try {
        await deleteEnrollment(enrollmentToDelete);
        setEnrollments(
          enrollments.filter(
            (enrollment) => enrollment._id !== enrollmentToDelete
          )
        );
        toast({
          title: "Success",
          description: "Enrollment deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting enrollment:", error);
        toast({
          title: "Error",
          description: "Failed to delete enrollment. Please try again.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteAlertOpen(false);
    setEnrollmentToDelete(null);
  };

  const handleViewEnrollment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsViewDialogOpen(true);
  };

  const handleEditEnrollment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setEditForm({
      preferredLanguage: enrollment.preferredLanguage,
      message: enrollment.message,
      courseId: enrollment.courseId,
      categoryId: enrollment.categoryId,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateEnrollment = async () => {
    if (!selectedEnrollment) return;

    try {
      await updateEnrollment(selectedEnrollment._id, editForm);
      toast({
        title: "Success",
        description: "Enrollment updated successfully.",
      });
      setIsEditDialogOpen(false);
      fetchEnrollments();
    } catch (error) {
      console.error("Error updating enrollment:", error);
      toast({
        title: "Error",
        description: "Failed to update enrollment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Enrollment>[] = [
    {
      accessorKey: "userId.name",
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
        const name = row.original?.userId?.name;
        return (
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "userId.email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span>{row.original?.userId?.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "userId.phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          <span>{row.original?.userId?.phoneNumber}</span>
        </div>
      ),
    },
    {
      accessorKey: "userId.pageTitle",
      header: "Course",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <FileText className="w-4 h-4 mr-2" />
          <span>{row.original?.userId?.pageTitle}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const enrollment = row.original;

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
                onClick={() => handleViewEnrollment(enrollment)}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>View</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditEnrollment(enrollment)}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteEnrollment(enrollment._id)}
              >
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
    data: enrollments,
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
            <Users className="w-6 h-6 mr-2" /> Enrollments
          </motion.h1>
        </div>

        {/* Search and Table Section */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter enrollments..."
              value={
                (table.getColumn("userId.name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("userId.name")
                  ?.setFilterValue(event.target.value)
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
              <DialogTitle>Enrollment Details</DialogTitle>
            </DialogHeader>
            {selectedEnrollment && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="font-medium">
                    Name: {selectedEnrollment.userId.name}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>Email: {selectedEnrollment.userId.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Phone: {selectedEnrollment.userId.phoneNumber}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Course: {selectedEnrollment.userId.pageTitle}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span>Address: {selectedEnrollment.userId.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span>
                    Preferred Language: {selectedEnrollment.preferredLanguage}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span>Message: {selectedEnrollment.message}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span>Course ID: {selectedEnrollment.courseId}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span>Category ID: {selectedEnrollment.categoryId}</span>
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Enrollment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Preferred Language
                </label>
                <Input
                  value={editForm.preferredLanguage}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      preferredLanguage: e.target.value,
                    })
                  }
                  placeholder="Enter preferred language"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <Textarea
                  value={editForm.message}
                  onChange={(e) =>
                    setEditForm({ ...editForm, message: e.target.value })
                  }
                  placeholder="Enter message"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Course ID</label>
                <Input
                  value={editForm.courseId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, courseId: e.target.value })
                  }
                  placeholder="Enter course ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category ID</label>
                <Input
                  value={editForm.categoryId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, categoryId: e.target.value })
                  }
                  placeholder="Enter category ID"
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
              <Button onClick={handleUpdateEnrollment}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                enrollment and remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteEnrollment}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Enrollments;
