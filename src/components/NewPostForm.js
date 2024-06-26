// src/components/NewPostForm.jsx
import React, { useState } from "react";
import axios from "axios";

const NewPostForm = ({ addPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/post", {
        title,
        content,
      });
      if (response.status === 201) {
        const newPost = response.data; // assuming the response contains the new post with its ID
        addPost(newPost); // pass the entire new post object including the ID
        setTitle("");
        setContent("");
        console.log("New post successfully added");
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Add Post</button>
    </form>
  );
};

export default NewPostForm;
