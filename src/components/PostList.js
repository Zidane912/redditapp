// src/components/PostList.js
import React from "react";
import Post from "./Post";
import '../App.css';

const PostList = ({ posts, replies, deletePost, editPost }) => {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} deletePost={deletePost} editPost={editPost} />
      ))}
    </div>
  );
};

export default PostList;
