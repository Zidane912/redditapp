import React from "react";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';

const DeleteButton = ({ post, deletePost }) => {

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/delete", {
        id: post.id
      });
      if (response.status === 200) {
        deletePost(post.id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <button type="submit">
            <i className="fa-solid fa-trash fa-fw"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteButton;
