// src/pages/Contact.js
import { Component } from "react";
import "./contact.css";
import Navbar from "../Navbar";

class Contact extends Component {
  state = {
    fullName: "",
    email: "",
    message: "",
    loading: false,
    statusMessage: ""
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, statusMessage: "" });

    const { fullName, email, message } = this.state;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName, email, message })
      });

      if (response.ok) {
        this.setState({
          statusMessage: "Thanks for reaching out! We'll get back to you soon.",
          fullName: "",
          email: "",
          message: ""
        });
      } else {
        const errorData = await response.json();
        this.setState({
          statusMessage: errorData.error || "Something went wrong. Please try again."
        });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      this.setState({ statusMessage: "Server error. Please try again later." });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { fullName, email, message, loading, statusMessage } = this.state;

    return (
      <>
        <Navbar />
        <div className="contact-container">
          <div className="contact-header">
            <h2 className="contact-title">Contact Us</h2>
            <div className="section-divider"></div>
            <p className="contact-subtitle">
              Have a question, suggestion, or just want to say hello? 
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <form className="contact-form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={fullName}
                placeholder="Enter your name"
                onChange={this.handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={this.handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                name="message"
                rows="5"
                value={message}
                placeholder="Write your message here..."
                onChange={this.handleChange}
                className="form-textarea"
                required
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

            {statusMessage && <p className="status-message">{statusMessage}</p>}
          </form>
        </div>
      </>
    );
  }
}

export default Contact;
