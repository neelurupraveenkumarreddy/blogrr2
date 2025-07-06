// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register  from "./components/Register";
import Home from "./components/Home";
import BlogPage from "./components/BlogPage";
import Upload from "./components/Upload";
import Profile from "./components/Profile";
import Authors from "./components/Authors";
import Contact from "./components/Contact";
import AdminStatistics from "./components/AdminStatistics";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersManagement from "./components/UsersManagement";
import ProfilesManagement from "./components/ProfilesManagement";
import PostsManagement from "./components/PostsManagement";
import AdminCatTag from "./components/AdminCatTag";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route path="/" element={<Home/>} />
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/blogpage/:id" element={<BlogPage/>}/>
        <Route exact path="/upload" element={<Upload/>} />
        <Route exact path="/profile/:userId" element={<Profile/>} />
        <Route exact path="/authors" element={<Authors/>} />
        <Route exact path="/contact" element={<Contact/>} />
        <Route exact path="/admin/categories-tags" element={<AdminCatTag/>}/>
        <Route exact path="/admin/" element={<AdminStatistics/>}/>
        <Route exact path="/admin/users" element={<UsersManagement/>} />
        <Route exact path="/admin/profiles" element={<ProfilesManagement/>} />
        <Route exact path="/admin/posts" element={<PostsManagement/>} />

      </Routes>
    </Router>
  );
}

export default App;
