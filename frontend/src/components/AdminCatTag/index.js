import React, { Component } from "react";
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
  };

  componentDidMount() {
    this.fetchCategories();
    this.fetchTags();
    this.fetchPosts();
  }

  fetchCategories = async () => {
    const res = await fetch("http://localhost:8080/api/categories");
    const data = await res.json();
    this.setState({ categories: data });
  };

  fetchTags = async () => {
    const res = await fetch("http://localhost:8080/api/tags");
    const data = await res.json();
    this.setState({ tags: data });
  };

  fetchPosts = async () => {
    const res = await fetch("http://localhost:8080/api/posts");
    const posts = await res.json();

    const postCounts = {};
    posts.forEach((post) => {
      const catId = post.category_id;
      postCounts[catId] = (postCounts[catId] || 0) + 1;
    });

    this.setState({ posts, postCounts });
  };

  handleCategoryAdd = async () => {
    const { newCategory } = this.state;
    if (!newCategory.trim()) return;

    await fetch("http://localhost:8080/api/categories/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    });

    this.setState({ newCategory: "" });
    this.fetchCategories();
  };

  handleTagAdd = async () => {
    const { newTag } = this.state;
    if (!newTag.trim()) return;

    await fetch("http://localhost:8080/api/tags/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag }),
    });

    this.setState({ newTag: "" });
    this.fetchTags();
  };

  handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    await fetch(`http://localhost:8080/api/categories/${id}`, {
      method: "DELETE",
    });
    this.fetchCategories();
  };

  handleDeleteTag = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;
    await fetch(`http://localhost:8080/api/tags/${id}`, {
      method: "DELETE",
    });
    this.fetchTags();
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
    } = this.state;

    const filteredCategories = categories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const filteredTags = tags.filter((tag) =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase())
    );

    return (
      <><AdminNavbar/>
      <div className="admin-container">
        <h2>Categories & Tags</h2>

        {/* Categories */}
        <section>
          <h3>Categories</h3>
          <div className="add-input">
            <input
              type="text"
              placeholder="new category"
              value={newCategory}
              onChange={(e) => this.setState({ newCategory: e.target.value })}
            />
            <button onClick={this.handleCategoryAdd}>Add</button>
          </div>

          <input
            type="text"
            placeholder="Search categories..."
            className="search-input"
            value={categorySearch}
            onChange={(e) => this.setState({ categorySearch: e.target.value })}
          />

          <table>
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
                  <td>{cat.name}</td>
                  <td>{postCounts[cat.id] || 0}</td>
                  <td>
                    <button onClick={() => this.handleDeleteCategory(cat.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Tags */}
        <section>
          <h3>Tags</h3>
          <div className="add-input">
            <input
              type="text"
              placeholder="new tag"
              value={newTag}
              onChange={(e) => this.setState({ newTag: e.target.value })}
            />
            <button onClick={this.handleTagAdd}>Add</button>
          </div>

          <input
            type="text"
            placeholder="Search tags..."
            className="search-input"
            value={tagSearch}
            onChange={(e) => this.setState({ tagSearch: e.target.value })}
          />

          <table>
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
                  <td>{tag.slug}</td>
                  <td>{tag.postCount || 0}</td>
                  <td>
                    <button onClick={() => this.handleDeleteTag(tag.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div></>
    );
  }
}

export default AdminCatTag;
