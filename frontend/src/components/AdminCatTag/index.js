import React, { Component } from "react";
import Cookies from "js-cookie";
import "./admin.css";
import AdminNavbar from "../AdminNavbar";

class AdminCatTag extends Component {
  state = {
    categories: [],
    tags: [],
    posts: [],
    newCategory: "",
    newTag: "",
    categorySearch: "",
    tagSearch: "",
    postCounts: {},
    Jtoken: "",
    loading: true,
    error: null
  };

  componentDidMount() {
    const Jtoken = Cookies.get("jwt_token");
    if (!Jtoken) {
      window.location.href = "/login";
      return;
    }
    
    this.setState({ Jtoken }, async () => {
      try {
        await Promise.all([
          this.fetchCategories(),
          this.fetchTags(),
          this.fetchPosts()
        ]);
        this.setState({ loading: false });
      } catch (error) {
        this.setState({ error: "Failed to load data", loading: false });
      }
    });
  }

  fetchCategories = async () => {
    const { Jtoken } = this.state;
    const res = await fetch("/api/categories", {
      headers: {
        Authorization: `Bearer ${Jtoken}`
      }
    });
    const data = await res.json();
    this.setState({ categories: data });
  };

  fetchTags = async () => {
    const { Jtoken } = this.state;
    const res = await fetch("/api/tags/view", {
      headers: {
        Authorization: `Bearer ${Jtoken}`
      }
    });
    const data = await res.json();
    this.setState({ tags: data });
  };

  fetchPosts = async () => {
    const { Jtoken } = this.state;
    const res = await fetch("/api/posts", {
      headers: {
        Authorization: `Bearer ${Jtoken}`
      }
    });
    const posts = await res.json();

    const postCounts = {};
    posts.forEach((post) => {
      const catId = post.category_id;
      postCounts[catId] = (postCounts[catId] || 0) + 1;
    });

    this.setState({ posts, postCounts });
  };

  handleCategoryAdd = async () => {
    const { newCategory, Jtoken } = this.state;
    if (!newCategory.trim()) {
      this.setState({ error: "Category name cannot be empty" });
      return;
    }

    try {
      await fetch("/api/categories/secure/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${Jtoken}`
        },
        body: JSON.stringify({ name: newCategory }),
      });

      this.setState({ newCategory: "", error: null });
      this.fetchCategories();
    } catch (error) {
      this.setState({ error: "Failed to add category" });
    }
  };

  handleTagAdd = async () => {
    const { newTag, Jtoken } = this.state;
    if (!newTag.trim()) {
      this.setState({ error: "Tag name cannot be empty" });
      return;
    }

    try {
      await fetch("/api/tags/secure/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${Jtoken}`
        },
        body: JSON.stringify({ name: newTag }),
      });

      this.setState({ newTag: "", error: null });
      this.fetchTags();
    } catch (error) {
      this.setState({ error: "Failed to add tag" });
    }
  };

  handleDeleteCategory = async (id) => {
    const { Jtoken } = this.state;
    if (!window.confirm("Are you sure you want to delete this category? This cannot be undone.")) return;
    
    try {
      await fetch(`/api/categories/secure/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${Jtoken}`
        },
      });
      this.fetchCategories();
    } catch (error) {
      this.setState({ error: "Failed to delete category" });
    }
  };

  handleDeleteTag = async (id) => {
    const { Jtoken } = this.state;
    if (!window.confirm("Are you sure you want to delete this tag? This cannot be undone.")) return;
    
    try {
      await fetch(`/api/tags/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${Jtoken}`
        },
      });
      this.fetchTags();
    } catch (error) {
      this.setState({ error: "Failed to delete tag" });
    }
  };

  render() {
    const {
      categories,
      tags,
      newCategory,
      newTag,
      postCounts,
      categorySearch,
      tagSearch,
      loading,
      error
    } = this.state;

    const filteredCategories = categories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const filteredTags = tags.filter((tag) =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase())
    );

    if (loading) {
      return (
        <>
          <AdminNavbar />
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Loading categories and tags...</p>
          </div>
        </>
      );
    }

    if (error) {
      return (
        <>
          <AdminNavbar />
          <div className="admin-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        </>
      );
    }

    return (
      <>
        <AdminNavbar />
        <div className="admin-cattag-container">
          <h1 className="admin-page-title">
            <i className="fas fa-tags"></i> Categories & Tags
          </h1>

          {error && (
            <div className="admin-error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Categories Section */}
          <section className="admin-section">
            <h2 className="section-header">
              <i className="fas fa-folder"></i> Categories
            </h2>
            
            <div className="admin-add-form">
              <input
                type="text"
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => this.setState({ newCategory: e.target.value })}
                className="admin-input"
              />
              <button 
                onClick={this.handleCategoryAdd}
                className="admin-button primary"
              >
                <i className="fas fa-plus"></i> Add Category
              </button>
            </div>

            <div className="admin-search-container">
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => this.setState({ categorySearch: e.target.value })}
                className="admin-search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Posts</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.name}</td>
                      <td>{cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}</td>
                      <td>{postCounts[cat.id] || 0}</td>
                      <td>
                        <button 
                          onClick={() => this.handleDeleteCategory(cat.id)}
                          className="admin-button danger"
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tags Section */}
          <section className="admin-section">
            <h2 className="section-header">
              <i className="fas fa-tag"></i> Tags
            </h2>
            
            <div className="admin-add-form">
              <input
                type="text"
                placeholder="Enter new tag name"
                value={newTag}
                onChange={(e) => this.setState({ newTag: e.target.value })}
                className="admin-input"
              />
              <button 
                onClick={this.handleTagAdd}
                className="admin-button primary"
              >
                <i className="fas fa-plus"></i> Add Tag
              </button>
            </div>

            <div className="admin-search-container">
              <input
                type="text"
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => this.setState({ tagSearch: e.target.value })}
                className="admin-search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Posts</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTags.map((tag) => (
                    <tr key={tag.id}>
                      <td>{tag.name}</td>
                      <td>{tag.slug || tag.name.toLowerCase().replace(/\s+/g, '-')}</td>
                      <td>{tag.postCount || 0}</td>
                      <td>
                        <button 
                          onClick={() => this.handleDeleteTag(tag.id)}
                          className="admin-button danger"
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </>
    );
  }
}

export default AdminCatTag;