import React, { useState } from "react";
import axios from "axios";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import ReplyButton from "./ReplyButton";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Post = ({ post, replies, addReply, deletePost, editPost, deleteReply, editReply }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyBeingEdited, setReplyBeingEdited] = useState(null);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [replyContent, setReplyContent] = useState('');
  const [editedReplyContent, setEditedReplyContent] = useState('');

  const handlePostClick = async () => {
    try {
      const response = await axios.post("http://ec2-52-56-192-208.eu-west-2.compute.amazonaws.com/editPost", {
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
      const response = await axios.post("http://ec2-52-56-192-208.eu-west-2.compute.amazonaws.com/addReply", {
        post_id: post.id,
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

  const handleEditReplyClick = async () => {
    try {
      const response = await axios.post("http://ec2-52-56-192-208.eu-west-2.compute.amazonaws.com/editReply", {
        post_id: replyBeingEdited.post_id,
        reply_id: replyBeingEdited.id,
        content: editedReplyContent
      });
      if (response.status === 201) {
        editReply(response.data);
        setReplyBeingEdited(null);
      }
    } catch (error) {
      console.error("Error saving edited reply:", error);
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
            <div className="save-cancel-buttons d-flex justify-content-end">
              <button onClick={handlePostClick}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="row d-flex justify-content-between align-items-center">
            <div className="col">
              <h2 className="post-title">{post.title}</h2>
            </div>
            <div className="col d-flex justify-content-end">
              <ReplyButton onClick={() => setIsReplying(!isReplying)} />
              <EditButton onClick={() => setIsEditing(true)} />
              <DeleteButton item={post} deleteItem={deletePost} itemType="post" />
            </div>
          </div>
        )}
      </div>
      {!isEditing && (
        <div className="post-content">
          <p>{post.content}</p>
        </div>
      )}
      {isReplying && (
        <div className="edit-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="save-cancel-buttons d-flex justify-content-end">
            <button onClick={handleReplyClick}>Save</button>
            <button onClick={() => setIsReplying(false)}>Cancel</button>
          </div>
        </div>
      )}
      {replies && replies.length > 0 && (
        <div className="replies">
          {replies.map((reply) => (
            <div key={reply.id} className="row reply">
              {replyBeingEdited && replyBeingEdited.id === reply.id ? (
                <div className="col edit-form">
                  <textarea
                    value={editedReplyContent}
                    onChange={(e) => setEditedReplyContent(e.target.value)}
                  />
                  <div className="save-cancel-buttons d-flex justify-content-end">
                    <button className="save-button" onClick={handleEditReplyClick}>Save</button>
                    <button className="cancel-button" onClick={() => setReplyBeingEdited(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="reply-wrapper">
                    <div className="arrow"></div>
                    <div className="reply-content">
                      <div className="col">
                        <p>{reply.content}</p>
                      </div>
                      <div className="col d-flex justify-content-end">
                        <EditButton
                          onClick={() => {
                            setReplyBeingEdited(reply);
                            setEditedReplyContent(reply.content);
                          }}
                        />
                        <DeleteButton item={reply} deleteItem={deleteReply} itemType="reply" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
