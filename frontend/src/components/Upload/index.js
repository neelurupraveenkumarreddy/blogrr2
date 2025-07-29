// src/pages/UploadBlog.js
import { Component } from "react";
import Cookies from "js-cookie";
import ReactMarkdown from "react-markdown";
import Navbar from "../Navbar";
import "./upload.css";

class Upload extends Component {
  state = {
    title: "",
    content: "",
    category: "",
    categories: [],
    tagInput: "",
    availableTags: [],
    tagList: [],
    featuredImage: null,
    uploadState:"init",
    previewImage: null // for live image preview
  };

  componentDidMount() {
    this.getCategories();
     this.getAvailableTags();
  }

  getAvailableTags = async () => {
  try {
    const response = await fetch("/api/tags");
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    const data = await response.json();
    this.setState({ availableTags: data.map(tag => tag.name) });
  } catch (error) {
      this.setState({uploadState:"fail"})
    console.error("Error fetching tags:", error);
  }
};
  getCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      this.setState({ categories: data });
    } catch (error) {
      this.setState({uploadState:"fail"})
      console.error("Error fetching categories:", error);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState({
      featuredImage: file,
      previewImage: file ? URL.createObjectURL(file) : null
    });
  };

  handleTagInputChange = (e) => {
    this.setState({ tagInput: e.target.value });
  };

  handleTagKeyDown = (e) => {
    const { tagInput, tagList } = this.state;
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tagList.includes(newTag)) {
        this.setState({
          tagList: [...tagList, newTag],
          tagInput: ""
        });
      } else {
        this.setState({ tagInput: "" });
      }
    }
  };

  removeTag = (index) => {
    const tagList = [...tagList];
    tagList.splice(index, 1);
    this.setState({ tagList });
  };

  addMarkdown = (syntax) => {
    this.setState((prev) => ({
      content: prev.content + syntax
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({uploadState:"inpro"});
    const Jtoken=Cookies.get("jwt_token");
    const { title, content, category, tagList, featuredImage } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      let imageUrl =
        "https://res.cloudinary.com/dsixdalgl/image/upload/v1751453691/blog_images/mq4xv2eydvjwz3zshsiy.png";

      // Step 1: Upload image
      if (featuredImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", featuredImage);
        const imageUploadResponse = await fetch(
          "/api/images/upload",
          {
            method: "POST",
            body: imageFormData
          }
        );
        if (!imageUploadResponse.ok) {
          throw new Error("Image upload failed");
        }
        const imageUploadResult = await imageUploadResponse.json();
        imageUrl = imageUploadResult.url;
      }

      // Step 2: Create blog post
      const blogData = {
        title,
        content,
        category_id: parseInt(category),
        image_url: imageUrl,
        author_id: user.id
      };

      const response = await fetch("/api/posts/secure/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Jtoken}`,
        },
        body: JSON.stringify(blogData)
      });

      if (!response.ok) {
        throw new Error("Failed to upload blog post.");
      }

      const result = await response.json();
      const postId = result.postId || result.id;

      // Step 3: Handle tags
      if (tagList.length > 0 && postId) {
        await fetch(
          `/api/tags/create-or-assign?postId=${postId}`,
          {
            method: "POST",
            headers: {
    "Content-Type": "application/json"
  },
            body: JSON.stringify(tagList)
          }
        );
      }

      this.setState({
        title: "",
        content: "",
        category: "",
        tagList: [],
        tagInput: "",
        featuredImage: null,
        previewImage: null,
        uploadState:"suc",
      });
    } catch (err) {
      this.setState({uploadState:"fail"})
      console.error(err);
      alert("Upload failed.");
    }
  };
UploadStateAction=()=>{
    const {uploadState}=this.state
    switch (uploadState){
      case "init":
        return this.initScreen()
      case "inpro":
        return this.loadingScreen()
      case "fail":
        return this.failureScreen()
      case "suc":
        return this.successScreen()
      default:
        return <></>;
    }
  }
  loadingScreen=()=>(
    <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Uploading blog...</p>
          </div>)
  failureScreen=()=>(
    <><h1>Unable to fetch the blog...Please Try again later...</h1>
  </>)
  initScreen=()=>{
     const {content,tagList,tagInput,previewImage,title,categories,category,availableTags}=this.state
    return (<div className="upload-page">
          <div className="upload-container">
            {/* LEFT SIDE - FORM */}
            <div className="upload-form-container">
              <h2 className="upload-header">Create New Post</h2>
              
              <form className="upload-form" onSubmit={this.handleSubmit}>
                {/* Title Input */}
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter post title"
                    className="form-input"
                    value={title}
                    onChange={this.handleChange}
                    required
                  />
                </div>

                {/* Category Dropdown */}
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-input"
                    value={category}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Input */}
                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <div className="tags-input-container">
                    <div className="tags-display">
                      {tagList.map((tag, index) => (
                        <span className="tag-pill" key={index}>
                          {tag}
                          <button
                            type="button"
                            className="tag-remove"
                            onClick={() => this.removeTag(index)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Type and press enter"
                        value={tagInput}
                        onChange={this.handleTagInputChange}
                        onKeyDown={this.handleTagKeyDown}
                        className="tags-input"
                      />
                    </div>
                    <div className="available-tags">
                      <p className="available-tags-label">Available tags:</p>
                      <div className="tags-list">
                        {availableTags.map((tag, index) => (
                          <span
                            key={index}
                            className={`available-tag ${
                              tagList.includes(tag) ? "disabled" : ""
                            }`}
                            onClick={() => {
                              if (!tagList.includes(tag)) {
                                this.setState((prev) => ({
                                  tagList: [...prev.tagList, tag]
                                }));
                              }
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Image Upload */}
                <div className="form-group">
                  <label className="form-label">Featured Image</label>
                  <div className="image-upload-container">
                    <label className="image-upload-label">
                      <input
                        type="file"
                        onChange={this.handleFileChange}
                        className="image-upload-input"
                        accept="image/*"
                      />
                      <div className="image-upload-box">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="image-preview"
                          />
                        ) : (
                          <div className="upload-placeholder">
                            <i className="fas fa-cloud-upload-alt"></i>
                            <p>Click to upload image</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  <i className="fas fa-upload"></i> Publish Post
                </button>
              </form>
            </div>

            {/* RIGHT SIDE - MARKDOWN EDITOR */}
            <div className="markdown-container">
              <div className="markdown-toolbar">
                <button type="button" onClick={() => this.addMarkdown("# ")}>
                  <i className="fas fa-heading"></i> H1
                </button>
                <button type="button" onClick={() => this.addMarkdown("## ")}>
                  <i className="fas fa-heading"></i> H2
                </button>
                <button type="button" onClick={() => this.addMarkdown("**bold**")}>
                  <i className="fas fa-bold"></i>
                </button>
                <button type="button" onClick={() => this.addMarkdown("_italic_")}>
                  <i className="fas fa-italic"></i>
                </button>
                <button type="button" onClick={() => this.addMarkdown("[link](url)")}>
                  <i className="fas fa-link"></i>
                </button>
                <button type="button" onClick={() => this.addMarkdown("![alt](image-url)")}>
                  <i className="fas fa-image"></i>
                </button>
                <button type="button" onClick={() => this.addMarkdown("- ")}>
                  <i className="fas fa-list-ul"></i>
                </button>
                <button type="button" onClick={() => this.addMarkdown("1. ")}>
                  <i className="fas fa-list-ol"></i>
                </button>
                <button type="button" onClick={() => this.addMarkdown("> ")}>
                  <i className="fas fa-quote-right"></i>
                </button>
                <button type="button" onClick={() => this.addMarkdown("```\ncode\n```")}>
                  <i className="fas fa-code"></i>
                </button>
              </div>

              <textarea
                className="markdown-editor"
                value={content}
                onChange={this.handleChange}
                name="content"
                placeholder="Write your markdown content here..."
              />

              <div className="preview-header">
                <h3>Live Preview</h3>
              </div>
              <div className="markdown-preview">
                {content ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <p className="preview-placeholder">Your preview will appear here</p>
                )}
              </div>
            </div>
          </div>
        </div>)
  }
  successScreen=()=>{
    return<><h1>Blog Uploaded Succesfully.....</h1></>
  }
  render() {
   return (
      <>
        <Navbar />
        {this.UploadStateAction()}
      </>
    );
  }
}

export default Upload;
