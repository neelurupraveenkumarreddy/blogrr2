// src/pages/admin/UsersManagement.js
import React, { Component } from "react";
import Cookies from "js-cookie";
import "./usermgt.css";
import AdminNavbar from "../AdminNavbar";

class UsersManagement extends Component {
  state = {
    users: [],
    searchTerm: "",
    Jtoken: "",
    isLoading: true,
    error: null
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    const Jtoken = Cookies.get("jwt_token");
    this.setState({ Jtoken: Jtoken, isLoading: true });
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      data.sort((a, b) => a.username.localeCompare(b.username));
      this.setState({ users: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      this.setState({ error: error.message, isLoading: false });
    }
  };

  deleteUser = async (id) => {
    const { Jtoken } = this.state;
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`/api/users/secure/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${Jtoken}` },
      });
      if (response.ok) {
        alert("User deleted successfully");
        this.fetchUsers();
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting user. Please try again.");
    }
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    const { users, searchTerm, isLoading, error } = this.state;
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <AdminNavbar />
        <div className="users-management-container">
          <div className="users-management-header">
            <h2 className="users-management-title">Manage Users</h2>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={this.handleSearchChange}
              />
              <button className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-spinner">Loading users...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="no-users-message">
              {searchTerm ? "No matching users found" : "No users available"}
            </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className="user-item">
                      <td>{index + 1}</td>
                      <td className="username">{user.username}</td>
                      <td className="user-email">{user.email}</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => this.deleteUser(user.id)}
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

export default UsersManagement;