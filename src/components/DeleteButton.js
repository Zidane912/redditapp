import React from "react";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';

const DeleteButton = ({ post, deletePost }) => {

  const removePost = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/delete", {
        id: post.id
      });
      if (response.status === 204) {
        deletePost(post.id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <div className="row">
        <button onClick={removePost}>
          <i className="fa-solid fa-trash fa-fw"></i>
        </button>
      </div>
    </div>
  );
};

export default DeleteButton;
