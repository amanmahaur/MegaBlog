import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await appwriteService.getPosts();
        if (response) {
          setPosts(response.documents);
        }
      } catch (err) {
        setError("Failed to load posts. Please try again.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        {loading ? (
          <p className="text-center text-lg">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : posts.length > 0 ? (
          <div className="flex flex-wrap -m-2 py-1 px-1">
            {posts.map((post) => (
              <div
                key={post.$id}
                className="p-2 w-full sm:w-1/2 lg:w-1/4"
              >
                <PostCard {...post} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg">No posts found.</p>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
