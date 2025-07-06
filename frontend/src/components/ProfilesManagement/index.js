// src/pages/admin/ProfilesManagement.js
import React, { Component } from "react";
import Cookies from "js-cookie";
import "./profilemgt.css";
import AdminNavbar from "../AdminNavbar";

class ProfilesManagement extends Component {
  state = {
    profiles: [],
    searchTerm: "",
  };

  componentDidMount() {
    this.fetchProfiles();
  }

  fetchProfiles = async () => {
    try {
      const response = await fetch("/api/profiles");
      const data = await response.json();
      data.sort((a, b) => a.displayName.localeCompare(b.displayName));
      this.setState({ profiles: data });
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  deleteProfile = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      const response = await fetch(`/api/profiles/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${Cookies.get("jwt_token")}` },
      });
      if (response.ok) {
        alert("Profile deleted");
        this.fetchProfiles();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    const { profiles, searchTerm } = this.state;
    const filteredProfiles = profiles.filter((profile) =>
      profile.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <><AdminNavbar/>
      <div className="profiles-management-container">
        <h2 className="profiles-management-title">Manage Profiles</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by display name or handle..."
          value={searchTerm}
          onChange={this.handleSearchChange}
        />
        <ol className="profiles-list">
          {filteredProfiles.map((profile) => (
            <li key={profile.userId} className="profile-item">
              <div className="profile-info">
                <span className="display-name">{profile.displayName}</span>
                <span className="handle">@{profile.handle}</span>
              </div>
              <button className="delete-button" onClick={() => this.deleteProfile(profile.userId)}>
                Delete
              </button>
            </li>
          ))}
        </ol>
      </div></>
    );
  }
}

export default ProfilesManagement;
