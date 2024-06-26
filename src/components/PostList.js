import React from "react";
import Post from "./Post";


const PostList = ({ posts, deletePost, editPost }) => {

  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} deletePost={deletePost} editPost={editPost} />
      ))}
    </div>
  );
};

export default PostList;
