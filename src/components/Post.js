// src/components/Post.js
import React from "react";
import DeleteButton from "./DeleteButton";

const Post = ({ post }) => {
  return (
    <div className="post">
      <DeleteButton />
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
};

export default Post;
