// src/pages/admin/PostsManagement.js
import React, { Component } from "react";
import Cookies from "js-cookie";
import "./postmgt.css";
import AdminNavbar from "../AdminNavbar";

class PostsManagement extends Component {
  state = {
    posts: [],
    searchTerm: "",
    Jtoken:"",
  };

  componentDidMount() {
    this.fetchPosts();
  }

  fetchPosts = async () => {
    const Jtoken=Cookies.get("jwt_token")
    this.setState({Jtoken:Jtoken});
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      data.sort((a, b) => a.title.localeCompare(b.title));
      this.setState({ posts: data });
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  deletePost = async (id) => {
    const {Jtoken}=this.state
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/secure/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Jtoken}`,
        },
      });
      if (res.ok) {
        alert("Post deleted");
        this.fetchPosts();
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  render() {
    const { posts, searchTerm } = this.state;
    const filteredPosts = posts.filter((post) =>
      `${post.title} ${post.authorName} ${post.categoryName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    console.log(filteredPosts);
    return (
        <><AdminNavbar/>
        <div className="posts-management-container">
        <h2 className="posts-management-title">Manage Posts</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, author or category..."
          value={searchTerm}
          onChange={this.handleSearchChange}
        />
        <ol className="posts-list">
          {filteredPosts.map((post) => (
            <li key={post.id} className="post-item">
              <div className="post-info">
                <span className="post-title">{post.title}</span>
                <span className="post-meta">
                  by {post.authorName} in {post.categoryName}
                </span>
              </div>
              <button
                className="delete-button"
                onClick={() => this.deletePost(post.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ol>
      </div></>
    );
  }
}

export default PostsManagement;
