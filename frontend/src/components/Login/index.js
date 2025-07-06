// src/pages/Login.js
import { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import "./login.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to cookies
        Cookies.set("jwt_token", data.token, { expires: 1 }); // expires in 1 day

        // Save basic user info (excluding token) to localStorage
        const { token, ...userInfo } = data;
        localStorage.setItem("user", JSON.stringify(userInfo));

        alert(`Welcome, ${data.username} (${data.role})!`);

        // Redirect to different pages based on role (optional)
        if (data.role === "ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error");
    }
  };

  render() {
    const { email, password } = this.state;

    return (
      <div className="login-container">
        <h2 className="login-title">Welcome back</h2>
        <form className="login-form" onSubmit={this.handleLogin}>
          <label className="login-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={email}
            onChange={this.handleChange}
            className="login-input"
            required
          />

          <label className="login-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={this.handleChange}
            className="login-input"
            required
          />

          <button type="submit" className="login-button">Log In</button>
        </form>

        <p className="login-footer">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    );
  }
}

export default Login;
