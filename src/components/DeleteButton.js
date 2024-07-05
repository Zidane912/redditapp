// src/components/DeleteButton.js
import React from "react";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';

const DeleteButton = ({ item, deleteItem, itemType }) => {
  
  const handleDelete = async () => {
    const endpoint = itemType === 'post' ? 'deletePost' : 'deleteReply';
    try {
      const response = await axios.post(`http://127.0.0.1:5000/${endpoint}`, {
        id: item.id
      });
      if (response.status === 200) {
        deleteItem(item.id);
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    }
  };

  return (
    <button className="delete-button" onClick={handleDelete}>
      <i className="fa-solid fa-trash fa-fw"></i>
    </button>
  );
};

export default DeleteButton;
