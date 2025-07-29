import { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./login.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    loading: false,
    error: null,
    showPassword:false,
  };

  handleChange = (e) => {
    this.setState({ 
      [e.target.name]: e.target.value,
      error: null // Clear error when user types
    });
  };

    togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  };
  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    
    if (!email || !password) {
      this.setState({ error: "Please fill in all fields" });
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set("jwt_token", data.token, { expires: 1 });
        const { token, ...userInfo } = data;
        localStorage.setItem("user", JSON.stringify(userInfo));
        
        // Redirect based on role
        window.location.href = data.role === "ADMIN" ? "/admin" : "/";
      } else {
        this.setState({ 
          error: data.message || "Login failed. Please check your credentials.",
          loading: false
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      this.setState({ 
        error: "Server error. Please try again later.",
        loading: false
      });
    }
  };

  render() {
    const { email, password, loading, error ,showPassword} = this.state;

    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to continue to your account</p>
          </div>

          {error && (
            <div className="login-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={this.handleLogin}>
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={this.handleChange}
                  className="form-input"
                  required
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

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i> Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="footer-text">
              Don't have an account?{" "}
              <Link to="/register" className="footer-link">
                Create one now
              </Link>
            </p>
            <p className="footer-text">
              <Link to="/forgot-password" className="footer-link">
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;