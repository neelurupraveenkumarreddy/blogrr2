import React, { Component } from "react";
import "./adminstatis.css";
import AdminNavbar from "../AdminNavbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

class AdminStatistics extends Component {
  state = {
    users: [],
    posts: [],
    categories: [],
    tags: [],
    postTags: [],
    categoryUsage: [],
    tagUsage: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const [usersRes, postsRes, catRes, tagRes, postTagsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/posts"),
        fetch("/api/categories"),
        fetch("/api/tags"),
        fetch("/api/tags/post-tags")
      ]);

      if (!usersRes.ok || !postsRes.ok || !catRes.ok || !tagRes.ok || !postTagsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [users, posts, categories, tags, postTags] = await Promise.all([
        usersRes.json(),
        postsRes.json(),
        catRes.json(),
        tagRes.json(),
        postTagsRes.json()
      ]);

      this.setState({
        users,
        posts,
        categories,
        tags,
        postTags,
        categoryUsage: this.countCategoryUsage(posts, categories),
        tagUsage: this.countTagUsage(postTags, tags),
        loading: false
      });
    } catch (error) {
      console.error("Error loading statistics:", error);
      this.setState({ 
        error: "Failed to load statistics. Please try again later.",
        loading: false 
      });
    }
  };

  countCategoryUsage = (posts, categories) => {
    const counts = {};
    posts.forEach((p) => {
      counts[p.category_id] = (counts[p.category_id] || 0) + 1;
    });
    return categories.map((cat) => ({
      name: cat.name,
      count: counts[cat.id] || 0,
    }));
  };

  countTagUsage = (postTags, tags) => {
    const counts = {};
    postTags.forEach(([postId, tagId]) => {
      counts[tagId] = (counts[tagId] || 0) + 1;
    });
    return tags.map((tag) => ({
      name: tag.name,
      count: counts[tag.id] || 0,
    }));
  };

  countPostsPerMonth = (posts) => {
  const monthly = {};
  posts.forEach((post) => {
    const month = new Date(post.created_at).toLocaleString("default", { month: "short", year: "numeric" });
    monthly[month] = (monthly[month] || 0) + 1;
  });
  return Object.keys(monthly).map((month) => ({
    month,
    count: monthly[month]
  }));
};

countPostsByAuthors = (posts, users) => {
  const counts = {};
  posts.forEach((p) => {
    counts[p.author_id] = (counts[p.author_id] || 0) + 1;
  });

  return users.map((u) => ({
    name: u.username,
    count: counts[u.id] || 0
  }));
};


  render() {
    const { users, posts, categoryUsage, tagUsage, loading, error } = this.state;

    if (loading) {
      return (
        <>
          <AdminNavbar />
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Loading statistics...</p>
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

    const roles = [...new Set(users.map((u) => u.role))];
    const mostPopular = posts.reduce(
      (a, b) => (a.likes > b.likes ? a : b),
      {}
    );
    const latestPost = posts.reduce(
      (a, b) =>
        new Date(a.created_at || 0) > new Date(b.created_at || 0) ? a : b,
      {}
    );

    const COLORS = [
      "#a11008", "#f69200", "#020203", "#6c757d", "#28a745",
      "#17a2b8", "#ffc107", "#6610f2", "#e83e8c", "#fd7e14"
    ];

    return (
      <>
        <AdminNavbar />
        <div className="admin-statistics-container">
          <h1 className="admin-page-title">
            <i className="fas fa-chart-line"></i> Dashboard Statistics
          </h1>

          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{users.length}</h3>
                <p className="stat-label">Total Users</p>
              </div>
            </div>

            <div className="stat-card secondary">
              <div className="stat-icon">
                <i className="fas fa-newspaper"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{posts.length}</h3>
                <p className="stat-label">Total Posts</p>
              </div>
            </div>

            <div className="stat-card accent">
              <div className="stat-icon">
                <i className="fas fa-tags"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{this.state.tags.length}</h3>
                <p className="stat-label">Total Tags</p>
              </div>
            </div>

            <div className="stat-card dark">
              <div className="stat-icon">
                <i className="fas fa-folder"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{this.state.categories.length}</h3>
                <p className="stat-label">Categories</p>
              </div>
            </div>
          </div>

          {/* User Roles */}
          <section className="stats-section">
            <h2 className="section-title">
              <i className="fas fa-user-tag"></i> User Roles
            </h2>
            <div className="roles-container">
              {roles.map((role, index) => (
                <span key={role} className="role-tag" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                  {role}
                </span>
              ))}
            </div>
          </section>

          {/* Post Highlights */}
          <div className="post-highlights">
            <div className="highlight-card">
              <h3 className="highlight-title">
                <i className="fas fa-fire"></i> Most Popular Post
              </h3>
              <p className="highlight-content">
                "{mostPopular?.title || "No posts yet"}"
              </p>
              <p className="highlight-meta">
                {mostPopular?.likes || 0} characters
              </p>
            </div>

            <div className="highlight-card">
              <h3 className="highlight-title">
                <i className="fas fa-clock"></i> Latest Post
              </h3>
              <p className="highlight-content">
                "{latestPost?.title || "No posts yet"}"
              </p>
              <p className="highlight-meta">
                {latestPost?.created_at ? new Date(latestPost.created_at).toLocaleDateString() : "-"}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            <div className="chart-container">
              <h2 className="section-title">
                <i className="fas fa-folder"></i> Category Usage
              </h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryUsage}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#a11008" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-container">
              <h2 className="section-title">
                <i className="fas fa-tags"></i> Tag Usage
              </h2>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tagUsage}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {tagUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

 </div>
 <div className="chart-container">
  <h2 className="section-title"><i className="fas fa-calendar"></i> Posts Per Month</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={this.countPostsPerMonth(posts)}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#17a2b8" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>
 <div className="chart-container">
  <h2 className="section-title">
    <i className="fas fa-user"></i> Posts by Authors
  </h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={this.countPostsByAuthors(posts, users)}>
      <XAxis dataKey="name" tick={{ angle: -45, textAnchor: 'end' }} 
  interval={0} />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#28a745" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>
          </div>
        </div>
      </>
    );
  }
}

export default AdminStatistics;