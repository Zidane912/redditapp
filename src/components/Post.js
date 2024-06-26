// src/components/Post.js
import React from "react";
import DeleteButton from "./DeleteButton";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Post = ({ post, deletePost }) => {
  return (
    <div className="col post">
      <div className="post-header">
        <h2 className="post-title">{post.title}</h2>
        <DeleteButton post={post} deletePost={deletePost} />
      </div>
      <div className="row">
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default Post;
