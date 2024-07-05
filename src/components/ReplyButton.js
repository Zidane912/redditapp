// src/components/EditButton.js
import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css';

const ReplyButton = ({ onClick }) => {
  return (
    <button className="reply-button" onClick={onClick}>
      <i className="fa-solid fa-comment"></i>
    </button>
  );
};

export default ReplyButton;
