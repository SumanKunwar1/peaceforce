import { IBlogPost, BlogPost } from "@models";
import { IBlogPostInput } from "@typeInterface";
import { httpMessages } from "@utils/HttpMessage";
import { deleteFile } from "@utils/deleteFile";

class BlogPostService {
  async createBlogPost(blogPostData: IBlogPostInput): Promise<IBlogPost> {
    try {
      const newBlogPost = new BlogPost({
        ...blogPostData,
      });

      await newBlogPost.save();
      return newBlogPost;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getBlogPosts(): Promise<IBlogPost[]> {
    try {
      const blogPosts = await BlogPost.find();
      // Modify the response to include full URLs for images
      return blogPosts.map((post) => {
        const blogPost = post.toObject();
        return {
          ...blogPost,
          image: blogPost.image
            ? `/api/image/${blogPost.image}`
            : blogPost.image,
          author: {
            ...blogPost.author,
            avatar: blogPost.author?.avatar
              ? `/api/image/${blogPost.author.avatar}`
              : blogPost.author.avatar,
          },
        } as IBlogPost;
      });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async getBlogPostById(blogPostId: string): Promise<IBlogPost | null> {
    try {
      const blogPost = await BlogPost.findById(blogPostId);
      if (!blogPost) {
        throw httpMessages.USER_NOT_FOUND("Blog post");
      }
      const blogPostObj = blogPost.toObject();
      if (blogPostObj.image) {
        blogPostObj.image = `/api/image/${blogPostObj.image}`;
      }
      if (blogPostObj.author?.avatar) {
        blogPostObj.author.avatar = `/api/image/${blogPostObj.author.avatar}`;
      }

      return blogPostObj;
    } catch (error) {
      console.error("Error fetching blog post by ID:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async updateBlogPost(
    blogPostId: string,
    blogPostData: IBlogPostInput
  ): Promise<IBlogPost | null> {
    try {
      const existingBlogPost = await BlogPost.findById(blogPostId);
      if (!existingBlogPost) {
        throw httpMessages.USER_NOT_FOUND("Blog post");
      }

      // Handle avatar field
      // Handle avatar field
      if (blogPostData.author?.avatar) {
        console.log("Processing avatar field...");

        if (blogPostData.author.avatar === "") {
          console.log(
            "Avatar field is empty. Deleting existing avatar if present..."
          );

          if (existingBlogPost.author?.avatar) {
            console.log(
              `Deleting existing avatar: ${existingBlogPost.author.avatar}`
            );
            await deleteFile(existingBlogPost.author.avatar);
          }
          blogPostData.author.avatar = ""; // Set empty string
          console.log(
            "Avatar has been cleared. New avatar is set to an empty string."
          );
        } else if (!blogPostData.author.avatar.startsWith("/api/image/")) {
          console.log(
            "Avatar URL seems to be a new file path, updating avatar..."
          );

          if (existingBlogPost.author?.avatar) {
            console.log(
              `Deleting old avatar: ${existingBlogPost.author.avatar}`
            );
            await deleteFile(existingBlogPost.author.avatar);
          }

          // Save new avatar filename (assuming it's already saved somewhere)
          console.log(`New avatar image file: ${blogPostData.author.avatar}`);
          blogPostData.author.avatar = blogPostData.author.avatar;
        }
      }

      // Handle image field
      if (blogPostData.image) {
        console.log("Processing image field...");

        if (blogPostData.image === "") {
          console.log(
            "Image field is empty. Deleting existing image if present..."
          );

          if (existingBlogPost.image) {
            console.log(`Deleting existing image: ${existingBlogPost.image}`);
            await deleteFile(existingBlogPost.image);
          }
          blogPostData.image = ""; // Set empty string
          console.log(
            "Image has been cleared. New image is set to an empty string."
          );
        } else if (!blogPostData.image.startsWith("/api/image/")) {
          console.log(
            "Image URL seems to be a new file path, updating image..."
          );

          if (existingBlogPost.image) {
            console.log(`Deleting old image: ${existingBlogPost.image}`);
            await deleteFile(existingBlogPost.image);
          }

          // Save new image filename (assuming it's already saved somewhere)
          console.log(`New image file: ${blogPostData.image}`);
          blogPostData.image = blogPostData.image;
        }
      }

      // Update the blog post in the database
      const updatedBlogPost = await BlogPost.findByIdAndUpdate(
        blogPostId,
        blogPostData,
        { new: true }
      );

      if (!updatedBlogPost) {
        throw httpMessages.USER_NOT_FOUND("Blog post");
      }

      return updatedBlogPost;
    } catch (error) {
      console.error("Error updating blog post:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  async deleteBlogPost(blogPostId: string): Promise<IBlogPost | null> {
    try {
      const blogPostToDelete = await BlogPost.findById(blogPostId);
      if (!blogPostToDelete) {
        throw httpMessages.USER_NOT_FOUND("Blog post");
      }

      // Delete image and avatar files if they exist
      if (blogPostToDelete.image) {
        await deleteFile(blogPostToDelete.image);
      }

      if (blogPostToDelete.author?.avatar) {
        await deleteFile(blogPostToDelete.author.avatar);
      }

      // Delete the blog post itself
      await BlogPost.findByIdAndDelete(blogPostId);

      return blogPostToDelete;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}

export const blogPostService = new BlogPostService();
