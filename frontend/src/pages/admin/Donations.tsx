"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  Mail,
  Phone,
  FileText,
  Eye,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import type { IDonationData, IUser } from "@/types/donation";
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
import { getDonations, deleteDonation } from "@/lib/donations";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

const Donations: React.FC = () => {
  const [donations, setDonations] = useState<IDonationData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedDonation, setSelectedDonation] =
    useState<IDonationData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const fetchedDonations = await getDonations();
      setDonations(fetchedDonations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch donations. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDonation = (donationId: string) => {
    setDonationToDelete(donationId);
    setIsDeleteAlertOpen(true);
  };
  const confirmDeleteDonation = async () => {
    if (donationToDelete) {
      try {
        await deleteDonation(donationToDelete);
        setDonations(
          donations.filter((donation) => donation.id !== donationToDelete)
        );
        toast({
          title: "Success",
          description: "Donation deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting donation:", error);
        toast({
          title: "Error",
          description: "Failed to delete donation. Please try again.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteAlertOpen(false);
    setDonationToDelete(null);
  };

  const handleViewDonation = (donation: IDonationData) => {
    setSelectedDonation(donation);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<IDonationData>[] = [
    {
      accessorKey: "userId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Donor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original.userId as IUser;
        return (
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <span className="font-medium">{user?.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-1" />
          <span>{row.getValue("amount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {new Date(row.getValue("createdAt")).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "userId.email",
      header: "Email",
      cell: ({ row }) => {
        const user = row.original.userId as IUser;
        return (
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            <span>{user?.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "userId.phoneNumber",
      header: "Phone Number",
      cell: ({ row }) => {
        const user = row.original.userId as IUser;
        return (
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{user?.phoneNumber}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "userId.page",
      header: "Page",
      cell: ({ row }) => {
        const user = row.original.userId as IUser;
        return (
          <div className="flex items-center text-gray-600">
            <FileText className="w-4 h-4 mr-2" />
            <span>{user?.page}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "userId.pageTitle",
      header: "Page Title",
      cell: ({ row }) => {
        const user = row.original.userId as IUser;
        return <span>{user?.pageTitle}</span>;
      },
    },
    {
      accessorKey: "screenshot",
      header: "Screenshot",
      cell: ({ row }) => {
        const screenshot = row.getValue("screenshot");

        return screenshot ? (
          <div
            className="relative w-20 h-20 cursor-pointer"
            onClick={() => handleViewDonation(row.original)}
          >
            <img
              src={(screenshot as string) || "/placeholder.svg"}
              alt="Donation Screenshot"
              className="object-cover rounded-md w-full h-full border border-gray-200 hover:border-primary transition-colors"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity rounded-md flex items-center justify-center">
              <Eye className="w-5 h-5 text-white opacity-0 hover:opacity-100" />
            </div>
          </div>
        ) : (
          <span className="text-gray-400">No screenshot</span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const donation = row.original;
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
              <DropdownMenuItem onClick={() => handleViewDonation(donation)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>View</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteDonation(donation.id)}
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
    data: donations,
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
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-2xl font-bold flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Heart className="w-6 h-6 mr-2" /> Donations
          </motion.h1>
        </div>

        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter donations..."
              value={
                (table.getColumn("userId")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("userId")?.setFilterValue(event.target.value)
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <span className="font-medium">
                  Donor: {(selectedDonation?.userId as IUser).name}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Amount: {selectedDonation?.amount}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Date:{" "}
                  {new Date(selectedDonation?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span>Email: {(selectedDonation?.userId as IUser).email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>
                  Phone: {(selectedDonation?.userId as IUser).phoneNumber}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <FileText className="w-4 h-4 mr-2" />
                <span>Page: {(selectedDonation?.userId as IUser).page}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span>
                  Page Title: {(selectedDonation?.userId as IUser).pageTitle}
                </span>
              </div>
              <div className="space-y-2">
                <span className="font-medium">Screenshot:</span>
                {selectedDonation.screenshot ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-full max-h-[400px] flex justify-center bg-gray-50 p-4 rounded-lg">
                      <img
                        src={selectedDonation.screenshot || "/placeholder.svg"}
                        alt="Donation Screenshot"
                        className="object-contain rounded-md max-h-[400px] shadow-sm"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() =>
                        window.open(selectedDonation.screenshot, "_blank")
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" /> View Full Size
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <span className="text-gray-400 block">
                      No screenshot available
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              donation and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDonation}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Donations;
