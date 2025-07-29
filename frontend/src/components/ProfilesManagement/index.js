// src/pages/admin/ProfilesManagement.js
import React, { Component } from "react";
import Cookies from "js-cookie";
import "./profilemgt.css";
import AdminNavbar from "../AdminNavbar";

class ProfilesManagement extends Component {
  state = {
    profiles: [],
    searchTerm: "",
    Jtoken: "",
    isLoading: true,
    error: null
  };

  componentDidMount() {
    this.fetchProfiles();
  }

  fetchProfiles = async () => {
    const Jtoken = Cookies.get("jwt_token");
    this.setState({ Jtoken: Jtoken, isLoading: true });
    try {
      const response = await fetch("/api/profiles");
      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }
      const data = await response.json();
      data.sort((a, b) => a.displayName.localeCompare(b.displayName));
      this.setState({ profiles: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching profiles:", error);
      this.setState({ error: error.message, isLoading: false });
    }
  };

  deleteProfile = async (userId) => {
    const { Jtoken } = this.state;
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      const response = await fetch(`/api/profiles/secure/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${Jtoken}` },
      });
      if (response.ok) {
        alert("Profile deleted successfully");
        this.fetchProfiles();
      } else {
        throw new Error("Failed to delete profile");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting profile. Please try again.");
    }
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    const { profiles, searchTerm, isLoading, error } = this.state;
    const filteredProfiles = profiles.filter((profile) =>
      profile.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <AdminNavbar />
        <div className="profiles-management-container">
          <div className="profiles-management-header">
            <h2 className="profiles-management-title">Manage Profiles</h2>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by display name or handle..."
                value={searchTerm}
                onChange={this.handleSearchChange}
              />
              <button className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-spinner">Loading profiles...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredProfiles.length === 0 ? (
            <div className="no-profiles-message">
              {searchTerm ? "No matching profiles found" : "No profiles available"}
            </div>
          ) : (
            <div className="profiles-table-container">
              <table className="profiles-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Display Name</th>
                    <th>Handle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile, index) => (
                    <tr key={profile.userId} className="profile-item">
                      <td>{index + 1}</td>
                      <td className="display-name">{profile.displayName}</td>
                      <td className="handle">@{profile.handle}</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => this.deleteProfile(profile.userId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default ProfilesManagement;