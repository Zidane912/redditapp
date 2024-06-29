// src/components/EditButton.js
import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

const EditButton = ({ onClick }) => {
  return (
    <button className="edit-button" onClick={onClick}>
      <i className="fa-solid fa-pencil fa-fw"></i>
    </button>
  );
};

export default EditButton;
