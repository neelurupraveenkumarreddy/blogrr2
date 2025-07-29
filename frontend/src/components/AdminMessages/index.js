import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import AdminNavbar from "../AdminNavbar";
import "./adminMessages.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filterUnread, setFilterUnread] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(null); // For dropdown

  const fetchMessages = async () => {
    const token = Cookies.get("jwt_token");
    try {
      const res = await fetch("/api/contact/secure/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      // Sort messages with unread first
      const sortedMessages = data.sort((a, b) => (a.read === b.read) ? 0 : a.read ? 1 : -1);
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markAsRead = async (id) => {
    const token = Cookies.get("jwt_token");
    try {
      const res = await fetch(`/api/contact/secure/read/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        // Optimistically update UI without re-fetch
        setMessages(prev =>
          prev.map(msg =>
            msg.id === id ? { ...msg, read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const deleteMessage = async (id) => {
    const token = Cookies.get("jwt_token");
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const res = await fetch(`/api/contact/secure/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          // Remove message locally
          setMessages(prev => prev.filter(msg => msg.id !== id));
        }
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const toggleUnreadFilter = () => {
    setFilterUnread(!filterUnread);
  };

  const toggleExpandMessage = (id) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  const filteredMessages = filterUnread
    ? messages.filter(msg => !msg.read)
    : messages;

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="admin-messages-container">
        <div className="messages-header">
          <h2 className="messages-title">Contact Messages</h2>
          <div className="section-divider"></div>
          <div className="messages-controls">
            <button
              onClick={toggleUnreadFilter}
              className={`filter-button ${filterUnread ? 'active' : ''}`}
            >
              {filterUnread ? 'Show All' : 'Show Unread Only'}
            </button>
          </div>
        </div>

        <div className="messages-table-container">
          <table className="messages-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map(msg => (
                <tr
                  key={msg.id}
                  className={`message-row ${msg.read ? 'read' : 'unread'}`}
                >
                  <td className="message-name">{msg.fullName}</td>
                  <td className="message-email">{msg.email}</td>
                  <td className="message-text">
                    <div
                      className="message-preview"
                      onClick={() => toggleExpandMessage(msg.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {expandedMessage === msg.id
                        ? msg.message
                        : msg.message.length > 50
                          ? msg.message.substring(0, 50) + "..."
                          : msg.message}
                      {msg.message.length > 50 && (
                        <span className="dropdown-toggle">
                          {expandedMessage === msg.id ? " ▲" : " ▼"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="message-status">
                    {msg.read ? (
                      <span className="status-badge read-badge">Read</span>
                    ) : (
                      <span className="status-badge unread-badge">Unread</span>
                    )}
                  </td>
                  <td className="message-actions">
                    {!msg.read && (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        className="action-button mark-read-button"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="action-button delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMessages.length === 0 && (
            <div className="no-messages">
              {filterUnread ? 'No unread messages' : 'No messages found'}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMessages;
