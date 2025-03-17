"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  ClipboardPen,
  Eye,
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
import { useToast } from "@/hooks/use-toast";
import {
  getBookMemberships,
  updateBookMembership,
  deleteBookMembership,
} from "@/lib/bookMembershipApi";
import AdminLayout from "@/components/admin/AdminLayout";
import MembershipTypes from "./MembershipTypes";
import type { IBookMembership } from "@/types/bookMembership";

export interface IBookMembershipUpdate {
  _id?: string;
  membershipId?: string;
  amount?: number;
  paymentMethod?: "bank" | "esewa" | "khalti";
  mailingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  image?: File | string | null;
  paymentScreenshot?: File | string | null;
}

export const MembershipManagement: React.FC = () => {
  const [bookMemberships, setBookMemberships] = useState<IBookMembership[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBookMembership, setSelectedBookMembership] =
    useState<IBookMembership | null>(null);
  const [editFormData, setEditFormData] = useState<IBookMembershipUpdate>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState<
    string | null
  >(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchBookMemberships();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (paymentScreenshotPreview)
        URL.revokeObjectURL(paymentScreenshotPreview);
    };
  }, [imagePreview, paymentScreenshotPreview]);

  const fetchBookMemberships = async () => {
    try {
      const fetchedBookMemberships = await getBookMemberships();
      setBookMemberships(fetchedBookMemberships.bookMemberships);
    } catch (error) {
      console.error("Error fetching book memberships:", error);
      toast({
        title: "Error",
        description: "Failed to fetch book memberships. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditBookMembership = (bookMembership: IBookMembership) => {
    setSelectedBookMembership(bookMembership);
    setEditFormData({
      membershipId: (bookMembership.membershipId as any)._id,
      amount: bookMembership.amount,
      paymentMethod: bookMembership.paymentMethod,
      mailingAddress: bookMembership.mailingAddress,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBookMembership = async () => {
    if (!selectedBookMembership) return;

    try {
      const formData = new FormData();

      Object.entries(editFormData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "mailingAddress") {
            Object.entries(value).forEach(([addressKey, addressValue]) => {
              if (addressValue !== undefined) {
                formData.append(
                  `mailingAddress[${addressKey}]`,
                  addressValue as string
                );
              }
            });
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      await updateBookMembership(selectedBookMembership.id, formData);
      toast({
        title: "Success",
        description: "Book membership updated successfully.",
      });
      setIsEditDialogOpen(false);
      fetchBookMemberships();
    } catch (error) {
      console.error("Error updating book membership:", error);
      toast({
        title: "Error",
        description: "Failed to update book membership. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBookMembership = async (id: string) => {
    setSelectedBookMembership(
      bookMemberships.find((bm) => bm.id === id) || null
    );
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteBookMembership = async () => {
    if (!selectedBookMembership) return;

    try {
      await deleteBookMembership(selectedBookMembership.id);
      toast({
        title: "Success",
        description: "Book membership deleted successfully.",
      });
      fetchBookMemberships();
    } catch (error) {
      console.error("Error deleting book membership:", error);
      toast({
        title: "Error",
        description: "Failed to delete book membership. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteAlertOpen(false);
      setSelectedBookMembership(null);
    }
  };

  const handleViewDetails = (bookMembership: IBookMembership) => {
    setSelectedBookMembership(bookMembership);
    setIsViewDetailsOpen(true);
  };

  const columns: ColumnDef<IBookMembership>[] = [
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
    },
    {
      accessorKey: "userId.email",
      header: "Email",
    },
    {
      accessorKey: "userId.phoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "membershipId",
      header: "Membership Type",
      cell: ({ row }) => {
        const membership = row.original.membershipId as any;
        return membership.name;
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const bookMembership = row.original;

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
                onClick={() => handleViewDetails(bookMembership)}
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditBookMembership(bookMembership)}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteBookMembership(bookMembership.id)}
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
    data: bookMemberships,
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
  console.log("selectedMembership", selectedBookMembership);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-2xl font-bold flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ClipboardPen className="w-6 h-6 mr-2" /> Membership Management
          </motion.h1>
        </div>

        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4">Book Memberships</h2>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter book memberships..."
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

        <MembershipTypes />

        <AlertDialog
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                book membership for {selectedBookMembership?.userId.name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteBookMembership}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Book Membership Details</DialogTitle>
            </DialogHeader>
            {selectedBookMembership && (
              <div className="space-y-4">
                <p>
                  <strong>Name:</strong> {selectedBookMembership.userId.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedBookMembership.userId.email}
                </p>
                <p>
                  <strong>Phone Number:</strong>{" "}
                  {selectedBookMembership.userId.phoneNumber}
                </p>
                <p>
                  <strong>Membership Type:</strong>{" "}
                  {(selectedBookMembership.membershipId as any).name}
                </p>
                <p>
                  <strong>Amount:</strong> ${selectedBookMembership.amount}
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {selectedBookMembership.paymentMethod}
                </p>
                <div>
                  <strong>Mailing Address:</strong>
                  <p>{selectedBookMembership.mailingAddress.street}</p>
                  <p>
                    {selectedBookMembership.mailingAddress.city},{" "}
                    {selectedBookMembership.mailingAddress.state}{" "}
                    {selectedBookMembership.mailingAddress.postalCode}
                  </p>
                  <p>{selectedBookMembership.mailingAddress.country}</p>
                </div>
                {selectedBookMembership.image && (
                  <div>
                    <strong>Personal Image:</strong>
                    <img
                      src={
                        (selectedBookMembership.image as string) ||
                        "/placeholder.svg"
                      }
                      alt="Personal"
                      className="mt-2 max-w-full h-auto"
                    />
                  </div>
                )}
                {selectedBookMembership.paymentScreenshot && (
                  <div>
                    <strong>Payment Screenshot:</strong>
                    <img
                      src={
                        selectedBookMembership.paymentScreenshot ||
                        "/placeholder.svg"
                      }
                      alt="Payment Screenshot"
                      className="mt-2 max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Edit Book Membership</DialogTitle>
            </DialogHeader>
            {selectedBookMembership && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Membership Type
                  </label>
                  <Input
                    value={editFormData.membershipId}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        membershipId: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Amount
                  </label>
                  <Input
                    type="number"
                    value={editFormData.amount}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Payment Method
                  </label>
                  <select
                    value={editFormData.paymentMethod}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        paymentMethod: e.target.value as
                          | "bank"
                          | "esewa"
                          | "khalti",
                      })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="bank">Bank</option>
                    <option value="esewa">eSewa</option>
                    <option value="khalti">Khalti</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mailing Address
                  </label>
                  <Input
                    value={editFormData.mailingAddress?.street}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        mailingAddress: {
                          ...editFormData.mailingAddress,
                          street: e.target.value,
                        },
                      })
                    }
                    placeholder="Street"
                    className="mb-2"
                  />
                  <Input
                    value={editFormData.mailingAddress?.city}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        mailingAddress: {
                          ...editFormData.mailingAddress,
                          city: e.target.value,
                        },
                      })
                    }
                    placeholder="City"
                    className="mb-2"
                  />
                  <Input
                    value={editFormData.mailingAddress?.state}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        mailingAddress: {
                          ...editFormData.mailingAddress,
                          state: e.target.value,
                        },
                      })
                    }
                    placeholder="State"
                    className="mb-2"
                  />
                  <Input
                    value={editFormData.mailingAddress?.postalCode}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        mailingAddress: {
                          ...editFormData.mailingAddress,
                          postalCode: e.target.value,
                        },
                      })
                    }
                    placeholder="Postal Code"
                    className="mb-2"
                  />
                  <Input
                    value={editFormData.mailingAddress?.country}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        mailingAddress: {
                          ...editFormData.mailingAddress,
                          country: e.target.value,
                        },
                      })
                    }
                    placeholder="Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Personal Image
                  </label>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditFormData({ ...editFormData, image: file });
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="New Personal Image"
                      className="mt-2 max-w-full h-auto"
                    />
                  ) : (
                    selectedBookMembership.image && (
                      <img
                        src={
                          (selectedBookMembership.image as string) ||
                          "/placeholder.svg"
                        }
                        alt="Current Personal Image"
                        className="mt-2 max-w-full h-auto"
                      />
                    )
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Payment Screenshot
                  </label>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditFormData({
                          ...editFormData,
                          paymentScreenshot: file,
                        });
                        setPaymentScreenshotPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {paymentScreenshotPreview ? (
                    <img
                      src={paymentScreenshotPreview || "/placeholder.svg"}
                      alt="New Payment Screenshot"
                      className="mt-2 max-w-full h-auto"
                    />
                  ) : (
                    selectedBookMembership.paymentScreenshot && (
                      <img
                        src={
                          selectedBookMembership.paymentScreenshot ||
                          "/placeholder.svg"
                        }
                        alt="Current Payment Screenshot"
                        className="mt-2 max-w-full h-auto"
                      />
                    )
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateBookMembership}>
                Update Membership
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default MembershipManagement;
