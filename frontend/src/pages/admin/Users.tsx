import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { UserTable } from "../../components/admin/users/UserTable";
import { User } from "@/types/users";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
const Users = () => {
  const { users, isLoading, addUser, mutate } = useUsers();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User>>({});
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    phoneNumber: "",
    page: "",
    pageTitle: "",
    role: "user",
  });
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const { toast } = useToast();
  const handleAddUser = async () => {
    try {
      await addUser(newUser);
      setIsAddUserDialogOpen(false);
      setNewUser({
        name: "",
        email: "",
        phoneNumber: "",
        page: "",
        pageTitle: "",
        role: "user",
      });
      toast({
        title: "User added",
        description: "The new user has been successfully added.",
        duration: 4000,
      });
      // Trigger a revalidation to fetch the updated list
      mutate();
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleViewDetails = (user: User) => {
    setViewingUser(user);
    setIsViewDetailsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditUserDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`/api/user/${editingUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      await mutate();
      setIsEditUserDialogOpen(false);
      toast({
        title: "User updated",
        description: "The user has been successfully updated.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeletingUserId(userId);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!deletingUserId) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/user/${deletingUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await mutate();
      setIsDeleteAlertOpen(false);
      setDeletingUserId(null);
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Users
          </motion.h1>
          <motion.button
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddUserDialogOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </motion.button>
        </div>

        <div className="mb-4 flex space-x-4">
          <Select value={filterOption} onValueChange={setFilterOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="page">Page</SelectItem>
              <SelectItem value="pageTitle">Page Title</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <UserTable
            users={users}
            filterOption={filterOption}
            sortOrder={sortOrder}
            onViewDetails={handleViewDetails}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            isLoading={isLoading}
          />
        </motion.div>
      </div>

      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details of the new user below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phoneNumber" className="text-right">
                Phone
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                value={newUser.phoneNumber}
                onChange={(e) =>
                  setNewUser({ ...newUser, phoneNumber: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="page" className="text-right">
                Page
              </label>
              <Input
                id="page"
                value={newUser.page}
                onChange={(e) =>
                  setNewUser({ ...newUser, page: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="pageTitle" className="text-right">
                Page Title
              </label>
              <Input
                id="pageTitle"
                value={newUser.pageTitle}
                onChange={(e) =>
                  setNewUser({ ...newUser, pageTitle: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right">
                Role
              </label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Name
              </label>
              <Input
                id="edit-name"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-email" className="text-right">
                Email
              </label>
              <Input
                id="edit-email"
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-phoneNumber" className="text-right">
                Phone
              </label>
              <Input
                id="edit-phoneNumber"
                type="tel"
                value={editingUser.phoneNumber}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    phoneNumber: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-page" className="text-right">
                Page
              </label>
              <Input
                id="edit-page"
                value={editingUser.page}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, page: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-pageTitle" className="text-right">
                Page Title
              </label>
              <Input
                id="edit-pageTitle"
                value={editingUser.pageTitle}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, pageTitle: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-role" className="text-right">
                Role
              </label>
              <Select
                value={editingUser.role}
                onValueChange={(value) =>
                  setEditingUser({ ...editingUser, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isViewDetailsDialogOpen}
        onOpenChange={setIsViewDetailsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user.
            </DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Name:</span>
                <span className="col-span-3">{viewingUser.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Email:</span>
                <span className="col-span-3">{viewingUser.email}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Phone:</span>
                <span className="col-span-3">{viewingUser.phoneNumber}</span>
              </div>
              {viewingUser.address && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold text-right">Address:</span>
                  <span className="col-span-3">{viewingUser.address}</span>
                </div>
              )}
              {viewingUser.role && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold text-right">Role:</span>
                  <span className="col-span-3">{viewingUser.role}</span>
                </div>
              )}
              {viewingUser.page && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold text-right">Page:</span>
                  <span className="col-span-3">{viewingUser.page}</span>
                </div>
              )}
              {viewingUser.pageTitle && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold text-right">Page Title:</span>
                  <span className="col-span-3">{viewingUser.pageTitle}</span>
                </div>
              )}
              {viewingUser.cv && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold text-right">CV:</span>
                  <a
                    href={viewingUser.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-3 text-blue-500 underline"
                  >
                    View CV
                  </a>
                </div>
              )}
              {viewingUser.coverLetter && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold text-right">
                    Cover Letter:
                  </span>
                  <a
                    href={viewingUser.coverLetter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-3 text-blue-500 underline"
                  >
                    View Cover Letter
                  </a>
                </div>
              )}
              {viewingUser.jobPostId && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-semibold text-right">Job Post ID:</span>
                  <span className="col-span-3">{viewingUser.jobPostId}</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Alert Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Users;
