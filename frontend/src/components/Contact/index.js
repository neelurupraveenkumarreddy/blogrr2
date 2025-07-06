// src/pages/Contact.js
import React, { useState } from "react";
import "./contact.css";
import Navbar from "../Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Submitted:", formData);
    alert("Thanks for reaching out!");
    setFormData({ fullName: "", email: "", message: "" });
  };

  return (
    <><Navbar/>
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>Have a question, suggestion, or just want to say hello? Fill out the form below.</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          placeholder="Enter your name"
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleChange}
          required
        />

        <label>Message</label>
        <textarea
          name="message"
          rows="5"
          value={formData.message}
          placeholder="Write your message"
          onChange={handleChange}
          required
        />

        <button type="submit">Send Message</button>
      </form>
    </div></>
  );
};

export default Contact;
