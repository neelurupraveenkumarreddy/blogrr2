// src/pages/Register.js
import React, { Component } from "react";
import "./register.css";

class Register extends Component {
  state = {
    fullName: "",
    email: "",
    password: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, email, password } = this.state;
    const bdy=JSON.stringify({ username:fullName, email, password});
    console.log(bdy);
    try {
      const response = await fetch("http://localhost:8080/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bdy,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        console.log(response);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Server error");
    }
  };

  render() {
    const { fullName, email, password } = this.state;

    return (
      <div className="register-container">
        <h2 className="register-title">Create your account</h2>
        <form className="register-form" onSubmit={this.handleRegister}>
          <label className="register-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChange={this.handleChange}
            className="register-input"
            required
          />

          <label className="register-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={this.handleChange}
            className="register-input"
            required
          />

          <label className="register-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={password}
            onChange={this.handleChange}
            className="register-input"
            required
          />

          <button type="submit" className="register-button">Sign Up</button>
        </form>

        <p className="register-footer">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    );
  }
}

export default Register;
