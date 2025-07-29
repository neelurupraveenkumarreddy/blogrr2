import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./adminnavbar.css";

class AdminNavbar extends Component {
  state = {
    user: "",
    id: 0,
    menuOpen: false,
  };

  componentDidMount() {
    const jwtToken = Cookies.get("jwt_token");
    if (!jwtToken) {
      window.location.href = "/login";
      return;
    }
    this.getLoginDetails();
  }

  getLoginDetails = () => {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken) {
      const userData = localStorage.getItem("user");
      const { username, id } = JSON.parse(userData);
      this.setState({ user: username, id: id });
    } else {
      this.setState({ user: null, id: null });
    }
  };

  logout = () => {
    Cookies.remove("jwt_token");
    alert("Logging out...");
    window.location.href = "/login";
  };

  toggleMenu = () => {
    this.setState((prev) => ({ menuOpen: !prev.menuOpen }));
  };

  render() {
    const { user, id, menuOpen } = this.state;
    const token = Cookies.get("jwt_token");

    return (
      <nav className="admin-navbar">
        <div className="admin-navbar-container">
          <div className="admin-navbar-left">
            <Link to="/admin/" className="admin-navbar-logo">
              <span className="logo-text">Bloggr</span>
              <span className="logo-dot">.</span>
              <span className="logo-admin">Admin</span>
            </Link>
            <button 
              className={`admin-navbar-toggle ${menuOpen ? "open" : ""}`}
              onClick={this.toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="toggle-line"></span>
              <span className="toggle-line"></span>
              <span className="toggle-line"></span>
            </button>
          </div>

          <div className={`admin-navbar-menu ${menuOpen ? "open" : ""}`}>
            <div className="admin-nav-links">
              <Link to="/admin/" className="admin-navbar-link">
                <i className="fas fa-chart-bar"></i> Statistics
              </Link>
              <Link to="/admin/users" className="admin-navbar-link">
                <i className="fas fa-users"></i> Users
              </Link>
              <Link to="/admin/profiles" className="admin-navbar-link">
                <i className="fas fa-id-card"></i> Profiles
              </Link>
              <Link to="/admin/posts" className="admin-navbar-link">
                <i className="fas fa-newspaper"></i> Posts
              </Link>
              <Link to="/admin/categories-tags" className="admin-navbar-link">
                <i className="fas fa-tags"></i> Categories & Tags
              </Link>
              <Link to="/admin/messages" className="admin-navbar-link">
                <i className="fas fa-tags"></i> Messages
              </Link>
            </div>

            <div className="admin-nav-actions">
              {token ? (
                <>
                  <Link to={`/profile/${id}`} className="admin-navbar-profile">
                    <span className="profile-initial">{user ? user[0] : "?"}</span>
                  </Link>
                  <button 
                    className="admin-navbar-button secondary" 
                    onClick={this.logout}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </>
              ) : (
                <button 
                  className="admin-navbar-button primary"
                  onClick={() => window.location.href = "/login"}
                >
                  <i className="fas fa-sign-in-alt"></i> Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default AdminNavbar;