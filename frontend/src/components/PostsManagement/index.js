// src/pages/admin/PostsManagement.js
import React, { Component } from "react";
import Cookies from "js-cookie";
import "./postmgt.css";
import AdminNavbar from "../AdminNavbar";

class PostsManagement extends Component {
  state = {
    posts: [],
    searchTerm: "",
    Jtoken: "",
    isLoading: true,
    error: null
  };

  componentDidMount() {
    this.fetchPosts();
  }

  fetchPosts = async () => {
    const Jtoken = Cookies.get("jwt_token");
    this.setState({ Jtoken: Jtoken, isLoading: true });
    try {
      const res = await fetch("/api/posts/postswithnames");
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await res.json();
      data.sort((a, b) => a.title.localeCompare(b.title));
      this.setState({ posts: data, isLoading: false });
    } catch (err) {
      console.error("Error fetching posts:", err);
      this.setState({ error: err.message, isLoading: false });
    }
  };

  deletePost = async (id) => {
    const { Jtoken } = this.state;
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/secure/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Jtoken}`,
        },
      });
      if (res.ok) {
        alert("Post deleted successfully");
        this.fetchPosts();
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error deleting post. Please try again.");
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  render() {
    const { posts, searchTerm, isLoading, error } = this.state;
    
    const filteredPosts = posts.filter((post) =>
      `${post.title} ${post.authorName} ${post.categoryName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <AdminNavbar />
        <div className="posts-management-container">
          <div className="posts-management-header">
            <h2 className="posts-management-title">Manage Posts</h2>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by title, author or category..."
                value={searchTerm}
                onChange={this.handleSearchChange}
              />
              <button className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-spinner">Loading posts...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredPosts.length === 0 ? (
            <div className="no-posts-message">
              {searchTerm ? "No matching posts found" : "No posts available"}
            </div>
          ) : (
            <div className="posts-table-container">
              <table className="posts-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post, index) => (
                    <tr key={post.id} className="post-item">
                      <td>{index + 1}</td>
                      <td className="post-title">{post.title}</td>
                      <td className="post-author">{post.authorName}</td>
                      <td className="post-category">{post.categoryName}</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => this.deletePost(post.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default PostsManagement;