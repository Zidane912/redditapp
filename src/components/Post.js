// src/components/Post.js
import React, { useState } from "react";
import axios from "axios";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Post = ({ post, deletePost, editPost }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleSaveClick = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/edit", {
        id: post.id,
        title: editedTitle,
        content: editedContent
      });
      if (response.status === 200) {
        editPost(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div>
              <button onClick={handleSaveClick}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="post-title">{post.title}</h2>
            </div>
            <div className="actions">
              <EditButton onClick={() => setIsEditing(true)} />
              <DeleteButton post={post} deletePost={deletePost} />
            </div>
          </>
        )}
      </div>
      {!isEditing && (
        <div className="post-content">
          <p>{post.content}</p>
        </div>
      )}
    </div>
  );
};

export default Post;
