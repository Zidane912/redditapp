// src/components/NewPostForm.js
import React, { useState } from "react";
import axios from "axios";
import '../App.css';

const NewPostForm = ({ addPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/addPost", {
        title,
        content,
      });
      if (response.status === 201) {
        const newPost = response.data;
        addPost(newPost);
        setTitle("");
        setContent("");
        // console.log(newPost);
        // console.log("New post successfully added");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <form className="new-post-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <div className="d-flex justify-content-end">
        <button type="submit">Add Post</button>
      </div>
    </form>
  );
};

export default NewPostForm;
