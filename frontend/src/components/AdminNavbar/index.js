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
    window.location.href = "/login"; // 🔒 redirect if not authenticated
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
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/admin/" className="navbar-logo">Bloggr Admin</Link>
          <button className="navbar-toggle" onClick={this.toggleMenu}>
            ☰
          </button>
        </div>

        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          <Link to="/admin/" className="navbar-link">Statistics</Link>
          <Link to="/admin/users" className="navbar-link">Users</Link>
          <Link to="/admin/profiles" className="navbar-link">Profiles</Link>
          <Link to="/admin/posts" className="navbar-link">Posts</Link>
          <Link to="/admin/categories-tags" className="navbar-link">Categories & Tags</Link>

          {token ? (
            <>
                <div className="navbar-profile">{user ? user[0] : "?"}</div>
              <button className="navbar-button" onClick={this.logout}>Log out</button>
            </>
          ) : (
            <button className="navbar-button" onClick={() => window.location.href = "/login"}>Login</button>
          )}
        </div>
      </nav>
    );
  }
}

export default AdminNavbar;
