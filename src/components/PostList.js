import React from "react";
import Post from "./Post";


const PostList = ({ posts }) => {

  // cannot simply do readData() to test, will loop infinitley


  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
