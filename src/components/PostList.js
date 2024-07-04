import React from "react";
import Post from "./Post";

const PostList = ({ posts, replies, deletePost, editPost, addReply }) => {
  return (
    <div className="post-list">
      {posts.map(post => (
        <Post
          key={post.id}
          post={post}
          replies={replies.filter(reply => reply.postId === post.id)}
          deletePost={deletePost}
          editPost={editPost}
          addReply={addReply}
        />
      ))}
    </div>
  );
};

export default PostList;
