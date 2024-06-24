import React from "react";
import Post from "./Post";


const PostList = ({ posts, deletePost }) => {

  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} deletePost={deletePost} />
      ))}
    </div>
  );
};

export default PostList;
