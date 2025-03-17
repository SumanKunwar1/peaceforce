"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BlogPost } from "@/types/blog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/Loader";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

// Interface for date field which is missing in the original BlogPost interface
interface BlogPostWithDate extends BlogPost {
  date?: string;
}

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<BlogPostWithDate | null>(null);
  const [filterOption, setFilterOption] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { blogPosts, totalPages, isLoading, isError, mutate } = useBlogPosts();
  const { toast } = useToast();
  const [seoMeta, setSeoMeta] = useState({
    _id: "",
    pageTitle: "blogs",
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
          pageTitle: fetchedData.pageTitle || "blogs",
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

  const handleAddBlogPost = () => {
    navigate("/admin/blogs/add-new-blog");
  };

  const handleViewDetails = (post: BlogPostWithDate) => {
    setViewingPost(post);
    setIsViewDetailsDialogOpen(true);
  };

  const handleEditPost = (post: BlogPostWithDate) => {
    if (post.id) {
      navigate(`/admin/blogs/add-new-blog?id=${post.id}`);
    }
  };

  const handleDeletePost = (id: string | undefined) => {
    if (id) {
      setPostToDelete(id);
      setIsDeleteAlertOpen(true);
    }
  };

  const confirmDeletePost = async () => {
    if (postToDelete) {
      try {
        const response = await fetch(`/api/blogpost/${postToDelete}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete blog post");
        }

        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        });
        mutate();
      } catch (error) {
        console.error("Error deleting blog post:", error);
        toast({
          title: "Error",
          description: "Failed to delete blog post",
          variant: "destructive",
        });
      }
    }
    setIsDeleteAlertOpen(false);
    setPostToDelete(null);
  };

  const handleSelectPost = (id: string | undefined) => {
    if (id) {
      setSelectedPosts((prev) =>
        prev.includes(id)
          ? prev.filter((postId) => postId !== id)
          : [...prev, id]
      );
    }
  };

  const handleSelectAllPosts = () => {
    setSelectedPosts((prev) =>
      prev.length === blogPosts.length
        ? []
        : blogPosts
            .map((post) => post.id)
            .filter((id): id is string => id !== undefined)
    );
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading blog posts</div>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Blog Posts
          </motion.h1>
          <motion.button
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddBlogPost}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Blog
          </motion.button>
        </div>

        <div className="mb-4 flex space-x-4">
          <Select value={filterOption} onValueChange={setFilterOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="author">Author</SelectItem>
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
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search blog posts..."
                className="w-full pl-10 pr-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedPosts.length === blogPosts.length}
                    onCheckedChange={handleSelectAllPosts}
                  />
                </TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author & Date</TableHead>
                <TableHead>Read Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox
                      checked={
                        post.id ? selectedPosts.includes(post.id) : false
                      }
                      onCheckedChange={() => handleSelectPost(post.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <img
                        src={
                          typeof post.image === "string"
                            ? post.image
                            : "/placeholder.svg"
                        }
                        alt={post.title}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-gray-500">{post.excerpt}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-600">
                      {post.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <img
                        src={
                          typeof post.author.avatar === "string"
                            ? post.author.avatar
                            : "/placeholder.svg"
                        }
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      <div>
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-sm text-gray-500">
                          {(post as BlogPostWithDate).date || "No date"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{post.readTime} min</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
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
                          onClick={() =>
                            handleViewDetails(post as BlogPostWithDate)
                          }
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleEditPost(post as BlogPostWithDate)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <span className="mr-2">Show</span>
              <Select
                value={postsPerPage.toString()}
                onValueChange={(value) => setPostsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="ml-2">entries</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog
        open={isViewDetailsDialogOpen}
        onOpenChange={setIsViewDetailsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blog Post Details</DialogTitle>
            <DialogDescription>
              Detailed information about the blog post.
            </DialogDescription>
          </DialogHeader>
          {viewingPost && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Title:</span>
                <span className="col-span-3">{viewingPost.title}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Excerpt:</span>
                <span className="col-span-3">{viewingPost.excerpt}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Category:</span>
                <span className="col-span-3">{viewingPost.category}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Author:</span>
                <span className="col-span-3">{viewingPost.author.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Date:</span>
                <span className="col-span-3">
                  {viewingPost.date || "No date"}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Read Time:</span>
                <span className="col-span-3">{viewingPost.readTime} min</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold text-right">Content:</span>
                <span className="col-span-3">{viewingPost.content}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
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
              blog post and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePost}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Blog;
