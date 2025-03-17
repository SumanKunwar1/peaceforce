import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Loader from "@/components/Loader";

interface BlogPost {
  id: string;
  title: string;
  image: string;
  authorImage: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
}

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [heroImage, setHeroImage] = useState("");
  const [authorImage, setAuthorImage] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blogpost/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }
        const data = await response.json();
        setPost(data);
        setHeroImage(data.image);
        setAuthorImage(data.author.avatar);
        setContent(data.content);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        toast({
          title: "Error",
          description: "Failed to fetch blog post",
          variant: "destructive",
        });
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, toast]);

  const handleSaveUpdates = async () => {
    if (!post) return;

    try {
      const response = await fetch(`/api/blogpost/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: post.title,
          image: heroImage,
          authorImage,
          content,
          author: {
            name: post.author.name,
            role: post.author.role,
            avatar: authorImage,
          },
          tags: post.tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog post");
      }

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    }
  };

  if (!post) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Blog Post</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="heroImage">Hero Image URL</Label>
          <Input
            id="heroImage"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="authorImage">Author Image URL</Label>
          <Input
            id="authorImage"
            value={authorImage}
            onChange={(e) => setAuthorImage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>
        <Button onClick={handleSaveUpdates}>Save Updates</Button>
      </div>
    </div>
  );
};

export default BlogDetails;
