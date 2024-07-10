import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import PostList from "./components/PostList";
import NewPostForm from "./components/NewPostForm";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import axios from "axios";
import "./App.css";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    if (isAuthenticated) {
      const readData = async (endpoint, stateFunction) => {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/${endpoint}`);
          if (response.status === 200) {
            stateFunction(response.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const getUsers = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5000/getUsers");
          if (response.status === 200) {
            setUsers(response.data);
            console.log(response.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      getUsers();
      readData("readPosts", setPosts);
      readData("readReplies", setReplies);
    }
  }, [isAuthenticated]);

  const handleSignIn = (status, user) => {
    setIsAuthenticated(status);
    setCurrentUser(user);
  };

  const addPost = (post) => {
    setPosts([...posts, post]);
  };

  const addReply = (reply) => {
    setReplies([...replies, reply]);
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const deleteReply = (id) => {
    setReplies(replies.filter(reply => reply.id !== id));
  };

  const editPost = (editedPost) => {
    setPosts(posts.map(post => post.id === editedPost.id ? editedPost : post));
  };

  const editReply = (editedReply) => {
    setReplies(replies.map(reply => reply.id === editedReply.id ? editedReply : reply));
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/reddit" /> : <SignIn onSignIn={handleSignIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reddit" element={isAuthenticated ? (
            <>
              <Header />
              <NewPostForm addPost={addPost} user={currentUser} />
              <PostList users={users} posts={posts} replies={replies} deletePost={deletePost} editPost={editPost} addReply={addReply} deleteReply={deleteReply} editReply={editReply} user={currentUser} />
            </>
          ) : (
            <Navigate to="/" />
          )} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
