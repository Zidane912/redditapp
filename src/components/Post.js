import React, { useState } from "react";
import axios from "axios";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import ReplyButton from "./ReplyButton";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Post = ({ post, replies, addReply, deletePost, editPost }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [replyContent, setReplyContent] = useState('');

  const handlePostClick = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/edit", {
        id: post.id,
        title: editedTitle,
        content: editedContent
      });
      if (response.status === 201) {
        editPost(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleReplyClick = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/reply", {
        postId: post.id,
        content: replyContent
      });
      if (response.status === 201) {
        addReply(response.data);
        setReplyContent('');
        setIsReplying(false);
      }
    } catch (error) {
      console.error("Error saving reply:", error);
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
              <button onClick={handlePostClick}>Save</button>
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
      <div className="row">
        <ReplyButton onClick={() => setIsReplying(!isReplying)} />
      </div>
      {isReplying && (
        <div className="edit-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button onClick={handleReplyClick}>Save</button>
          <button onClick={() => setIsReplying(false)}>Cancel</button>
        </div>
      )}
      {replies && replies.length > 0 && (
        <div className="replies">
          {replies.map((reply) => (
            <div key={reply.id} className="reply">
              <p>{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
