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
    <div className="col post">
      <div className="row post-header">
        {isEditing ? (
          <div className="col edit-form">
            <div className="col">
              <div className="row">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              </div>
              <div className="row">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </div>
            </div>


            <div className="row justify-content-end">
              <div className="col-1">
                <button onClick={handleSaveClick}>Save</button>
              </div>
              <div className="col-1">
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>


          </div>
        ) : (
          <>
            <div className="col">
              <h2 className="post-title">{post.title}</h2>
            </div>
            <div className="col-1">
              <EditButton onClick={() => setIsEditing(true)} />
            </div>
            <div className="col-1">
              <DeleteButton post={post} deletePost={deletePost} />
            </div>
          </>
        )}
      </div>
      {!isEditing && (
        <div className="row">
          <p>{post.content}</p>
        </div>
      )}
    </div>
  );
};


export default Post;
