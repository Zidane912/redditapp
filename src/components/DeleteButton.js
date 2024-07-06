import React, { useState } from "react";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';
import DeleteModal from "./DeleteModal";

const DeleteButton = ({ item, deleteItem, itemType }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDelete = async () => {
    const endpoint = itemType === 'post' ? 'deletePost' : 'deleteReply';
    try {
      const response = await axios.post(`http://127.0.0.1:5000/${endpoint}`, {
        id: item.id
      });
      if (response.status === 200) {
        deleteItem(item.id);
        handleClose();
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    }
  };

  return (
    <>
      <button className="delete-button" onClick={handleShow}>
        <i className="fa-solid fa-trash fa-fw"></i>
      </button>
      <DeleteModal 
        show={showModal} 
        handleClose={handleClose} 
        handleDelete={handleDelete} 
        itemType={itemType}
      />
    </>
  );
};

export default DeleteButton;
