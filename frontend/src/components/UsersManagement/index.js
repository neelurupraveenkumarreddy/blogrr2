// src/pages/admin/UsersManagement.js
import React, { Component } from "react";
import Cookies from "js-cookie";
import "./usermgt.css";
import AdminNavbar from "../AdminNavbar";

class UsersManagement extends Component {
  state = {
    users: [],
    searchTerm: "",
    Jtoken:"",
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    const Jtoken=Cookies.get("jwt_token")
    this.setState({Jtoken:Jtoken});
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      data.sort((a, b) => a.username.localeCompare(b.username));
      this.setState({ users: data });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  deleteUser = async (id) => {
    const {Jtoken}=this.state
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`/api/users/secure/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${Jtoken}` },
      });
      if (response.ok) {
        alert("User deleted");
        this.fetchUsers();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    const { users, searchTerm } = this.state;
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <><AdminNavbar/>
      <div className="users-management-container">
        <h2 className="users-management-title">Manage Users</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={this.handleSearchChange}
        />
        <ol className="users-list">
          {filteredUsers.map((user) => (
            <li key={user.id} className="user-item">
              <div className="user-info">
                <span className="username">{user.username}</span>
                <span className="user-email">({user.email})</span>
              </div>
              <button className="delete-button" onClick={() => this.deleteUser(user.id)}>
                Delete
              </button>
            </li>
          ))}
        </ol>
      </div></>
    );
  }
}

export default UsersManagement;
