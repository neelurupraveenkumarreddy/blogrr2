import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import "./navb.css";

class Navbar extends Component {
  state = {
    user: "",
    id: 0,
    menuOpen: false
  };

  componentDidMount() {
    this.getlogindet();
  }

  getlogindet = () => {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken) {
      const k = localStorage.getItem("user");
      const { username, id } = JSON.parse(k);
      this.setState({ user: username, id: id });
    } else {
      this.setState({ user: null, id: null });
    }
  };

  logout = () => {
    Cookies.remove("jwt_token");
    alert(`Logging out`);
    window.location.href = "/login";
  };

  login = () => {
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
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <span className="logo-text">Bloggr</span>
              <span className="logo-dot">.</span>
            </Link>
          </div>

          <button 
            className={`navbar-toggle ${menuOpen ? "open" : ""}`} 
            onClick={this.toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="toggle-line"></span>
            <span className="toggle-line"></span>
            <span className="toggle-line"></span>
          </button>

          <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
            <div className="nav-links">
              <Link to="/" className="navbar-link">Home</Link>
              <Link to="/authors" className="navbar-link">Authors</Link>
              <Link to="/contact" className="navbar-link">Contact</Link>
            </div>

            <div className="nav-actions">
              {token ? (
                <>
                  <Link to="/upload" className="navbar-button primary">
                    <i className="fas fa-plus"></i> New Post
                  </Link>
                  <Link to={`/profile/${id}`} className="navbar-profile">
                    <span className="profile-initial">{user[0]}</span>
                  </Link>
                  <button className="navbar-button secondary" onClick={this.logout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </>
              ) : (
                <button className="navbar-button primary" onClick={this.login}>
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

export default Navbar;