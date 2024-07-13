import React from "react";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ currentUser, onSignOut }) => {
  return (
    <header className="row align-items-center header-container">
      <div className="title col d-flex justify-content-left">
        <h1>Reddit Clone</h1>
      </div>
      <div className="usertitle col d-flex justify-content-end align-items-center">
        <h2 className="username">{currentUser.username}</h2>
        <button className="btn signout-btn" onClick={onSignOut}>Sign Out</button>
      </div>
    </header>
  );
};

export default Header;
