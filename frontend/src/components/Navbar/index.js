// src/components/Navbar.js
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
    alert(`logging out`);
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
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">Bloggr</Link>
          <button className="navbar-toggle" onClick={this.toggleMenu}>
            ☰
          </button>
        </div>

        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/authors" className="navbar-link">Authors</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>

          {token ? (
            <>
              <Link to="/upload" className="navbar-button">New Post</Link>
              <Link to={`/profile/${id}`}>
                <div className="navbar-profile">{user[0]}</div>
              </Link>
              <button className="navbar-button" onClick={this.logout}>Log out</button>
            </>
          ) : (
            <button className="navbar-button" onClick={this.login}>Login</button>
          )}
        </div>
      </nav>
    );
  }
}

export default Navbar;
