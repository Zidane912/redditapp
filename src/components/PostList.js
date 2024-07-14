import React from "react";
import Post from "./Post";

const PostList = ({ posts, replies, deletePost, editPost, addReply, deleteReply, editReply, currentUser, users }) => {
  return (
    <div className="post-list">
      {posts.map(post => (
          <Post
            key={post.id}  // Ensure unique key for each post
            currentUser={currentUser}
            // users={users}
            post={post}
            replies={replies.filter(reply => reply.post_id === post.id)}
            deletePost={deletePost}
            editPost={editPost}
            addReply={addReply}
            deleteReply={deleteReply}
            editReply={editReply}
          />
      ))}
    </div>
  );
};

export default PostList;
