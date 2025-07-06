import React, { Component } from "react";
import "./adminstatis.css";
import AdminNavbar from "../AdminNavbar";

class AdminStatistics extends Component {
  state = {
    users: [],
    posts: [],
    categories: [],
    tags: [],
    usageCounts: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const [usersRes, postsRes, catRes, tagRes] = await Promise.all([
        fetch("http://localhost:8080/api/users"),
        fetch("http://localhost:8080/api/posts"),
        fetch("http://localhost:8080/api/categories"),
        fetch("http://localhost:8080/api/tags"),
      ]);

      const users = await usersRes.json();
      const posts = await postsRes.json();
      const categories = await catRes.json();
      const tags = await tagRes.json();

      const categoryUsage = this.countCategoryUsage(posts, categories);
      const tagUsage = this.countTagUsage(posts, tags);

      this.setState({
        users,
        posts,
        categories,
        tags,
        usageCounts: [...categoryUsage, ...tagUsage],
        loading: false,
      });
    } catch (error) {
      console.error("Error loading statistics:", error);
      this.setState({ loading: false }); // Still render something
    }
  };

  countCategoryUsage(posts, categories) {
    const counts = {};
    posts.forEach((p) => {
      counts[p.category_id] = (counts[p.category_id] || 0) + 1;
    });
    return categories.map((cat) => ({
      label: cat.name,
      count: counts[cat.id] || 0,
    }));
  }

  countTagUsage(posts, tags) {
    const counts = {};
    posts.forEach((p) => {
      if (Array.isArray(p.tag_ids)) {
        p.tag_ids.forEach((tagId) => {
          counts[tagId] = (counts[tagId] || 0) + 1;
        });
      }
    });
    return tags.map((tag) => ({
      label: tag.name,
      count: counts[tag.id] || 0,
    }));
  }

  render() {
    const { users, posts, usageCounts, loading } = this.state;

    if (loading) {
      return <div className="admin-statistics-container"><p>Loading statistics...</p></div>;
    }

    const roles = [...new Set(users.map((u) => u.role))];
    const mostPopular = posts.reduce(
      (a, b) => (a.content?.length > b.content?.length ? a : b),
      {}
    );
    const latestPost = posts.reduce(
      (a, b) =>
        new Date(a.created_at || 0) > new Date(b.created_at || 0) ? a : b,
      {}
    );

    return (
      <><AdminNavbar/>
      <div className="admin-statistics-container">
        <h2 className="page-title">Dashboard</h2>

        {/* User Stats */}
        <section className="stats-section">
          <h3 className="section-title">User Statistics</h3>
          <div className="stat-cards">
            <div className="stat-card">
              <p>Total Users</p>
              <h2>{users.length}</h2>
            </div>
            <div className="stat-card">
              <p>Roles</p>
              <h2>{roles.join(", ")}</h2>
            </div>
          </div>
        </section>

        {/* Post Stats */}
        <section className="stats-section">
          <h3 className="section-title">Post Statistics</h3>
          <div className="stat-cards">
            <div className="stat-card">
              <p>Most Popular Post</p>
              <h3>"{mostPopular?.title || "-"}"</h3>
            </div>
            <div className="stat-card">
              <p>Recently Created</p>
              <h3>"{latestPost?.title || "-"}"</h3>
            </div>
          </div>
        </section>

        {/* Usage Table */}
        <section className="stats-section">
          <h3 className="section-title">Category/Tag Usage</h3>
          <table className="usage-table">
            <thead>
              <tr>
                <th>Category/Tag</th>
                <th>Usage Count</th>
              </tr>
            </thead>
            <tbody>
              {usageCounts.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.label}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div></>
    );
  }
}

export default AdminStatistics;
