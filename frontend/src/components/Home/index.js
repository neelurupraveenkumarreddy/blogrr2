// src/pages/Home.js
import { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./home.css";

class Home extends Component {
  state = {
    featuredPosts: [],
    latestPosts: [],
    searchTerm: "",
    selectedCategoryId: "all",
    selectedTagId: "all",
    categories: [],
    tags: [],
  };

  componentDidMount() {
    this.getPosts();
    this.getCategories();
    this.getTags();
  }

  getPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      // assume each post comes back with a `tags` array, or undefined
      const sortedPosts = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      this.setState({
        latestPosts: sortedPosts,
        featuredPosts: sortedPosts.slice(0, 3),
      });
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  getCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      this.setState({ categories: [{ id: "all", name: "All" }, ...data] });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  getTags = async () => {
    try {
      const response = await fetch("/api/tags");
      if (!response.ok) throw new Error("Failed to fetch tags");
      const data = await response.json();
      this.setState({ tags: [{ id: "all", name: "All" }, ...data] });
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleCategoryChange = (e) => {
    this.setState({ selectedCategoryId: e.target.value });
  };

  handleTagChange = (e) => {
    this.setState({ selectedTagId: e.target.value });
  };

  render() {
    const {
      featuredPosts,
      latestPosts,
      searchTerm,
      selectedCategoryId,
      selectedTagId,
      categories,
      tags,
    } = this.state;

    const filteredPosts = latestPosts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategoryId === "all" ||
        post.category_id === parseInt(selectedCategoryId);

      const matchesTag =
        selectedTagId === "all" ||
        (Array.isArray(post.tags) &&
          post.tags.some((tag) => tag.id === parseInt(selectedTagId)));

      return matchesSearch && matchesCategory && matchesTag;
    });

    return (
      <>
        <Navbar />
        <div className="home-container">
          {/* Search Bar */}
          <div className="home-search-bar">
            <input
              className="home-search-input"
              type="text"
              placeholder="Search posts"
              value={searchTerm}
              onChange={this.handleSearchChange}
            />
          </div>

          {/* Filters */}
          <div className="home-filters">
            <select
              value={selectedCategoryId}
              onChange={this.handleCategoryChange}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select value={selectedTagId} onChange={this.handleTagChange}>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured */}
          <h2 className="home-section-title">Featured Posts</h2>
          <div className="home-featured-posts">
            {featuredPosts.map((post) => (
              <div className="featured-card" key={post.id}>
                <img
                  src={post.image_url}
                  alt="cover"
                  className="featured-image"
                />
                <h3 className="homePostTitle">{post.title}</h3>
                <p className="homePostContent">
                  {post.content.length > 100
                    ? post.content.substring(0, 100) + "..."
                    : post.content}
                </p>
              </div>
            ))}
          </div>

          {/* Latest */}
          <h2 className="home-section-title">Latest Posts</h2>
          <div className="home-latest-posts">
            {filteredPosts.map((post) => (
              <div className="latest-post" key={post.id}>
                <div className="latest-post-text">
                  <span className="post-category">{post.category}</span>
                  <h3 className="homePostTitle">{post.title}</h3>
                  <p className="homePostContent">
                    {post.content.length > 200
                      ? post.content.substring(0, 200) + "..."
                      : post.content}
                  </p>

                  {/* TAG BADGES */}
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map((t) => (
                        <span key={t.id} className="post-tag">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <button className="read-button">
                    <Link to={`/blogpage/${post.id}`}>Read More</Link>
                  </button>
                </div>
                <img
                  src={post.image_url}
                  alt="cover"
                  className="latest-post-img"
                />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default Home;
