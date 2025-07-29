import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./register.css";

class Register extends Component {
  state = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    error: null,
    success: false,
    showConfirmPassword:false,
    showPassword:false,
  };

  handleChange = (e) => {
    this.setState({ 
      [e.target.name]: e.target.value,
      error: null // Clear error when user types
    });
  };

  handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = this.state;
    
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      this.setState({ error: "Please fill in all fields" });
      return;
    }

    if (password !== confirmPassword) {
      this.setState({ error: "Passwords do not match" });
      return;
    }

    if (password.length < 6) {
      this.setState({ error: "Password must be at least 6 characters" });
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: fullName, 
          email, 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        this.setState({ 
          success: true,
          loading: false,
          fullName: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
      } else {
        this.setState({ 
          error: data.message || "Registration failed. Please try again.",
          loading: false
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      this.setState({ 
        error: "Server error. Please try again later.",
        loading: false
      });
    }
  };

    togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  };

  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility = () => {
    this.setState(prevState => ({
      showConfirmPassword: !prevState.showConfirmPassword
    }));
  };

  render() {
    const { fullName, email, password, confirmPassword, loading, error, success ,showPassword,showConfirmPassword} = this.state;

    if (success) {
      return (
        <div className="register-page">
          <div className="register-success">
            <i className="fas fa-check-circle"></i>
            <h2>Registration Successful!</h2>
            <p>Your account has been created successfully.</p>
            <Link to="/login" className="success-link">
              Proceed to Login
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <h1 className="register-title">Create Your Account</h1>
            <p className="register-subtitle">Join our community today</p>
          </div>

          {error && (
            <div className="register-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <form className="register-form" onSubmit={this.handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={this.handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={email}
                onChange={this.handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={this.handleChange}
                  className="form-input"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={this.togglePasswordVisibility}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={this.handleChange}
                  className="form-input"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={this.toggleConfirmPasswordVisibility}
                >
                  <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i> Sign Up
                </>
              )}
            </button>
          </form>

          <div className="register-footer">
            <p className="footer-text">
              Already have an account?{" "}
              <Link to="/login" className="footer-link">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;