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
  // const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        // const usersResponse = await axios.get("http://127.0.0.1:5000/getUsers");
        // if (usersResponse.status === 200) {
        //   setUsers(usersResponse.data);
        // }

        // Fetch posts
        const postsResponse = await axios.get("http://127.0.0.1:5000/readPosts");
        if (postsResponse.status === 200) {
          setPosts(postsResponse.data);
        }

        // Fetch replies
        const repliesResponse = await axios.get("http://127.0.0.1:5000/readReplies");
        if (repliesResponse.status === 200) {
          setReplies(repliesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors appropriately (e.g., set error state, show error message)
      } finally {
        // Ensure loading screen is shown for at least 3 seconds
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    };

    
    const checkAuth = () => {
      const sessionData = JSON.parse(localStorage.getItem("sessionData"));
      if (sessionData) {
        const { user, expiry } = sessionData;
        if (new Date().getTime() < expiry) {
          setIsAuthenticated(true);
          setCurrentUser(user);
        } else {
          localStorage.removeItem("sessionData");
        }
      }
      setIsLoading(false);
    };

    if (isAuthenticated) {
      fetchData();
    } else {
      checkAuth();
    }
  }, [isAuthenticated, posts, replies]); // runs whenever there are changes to these states


  const handleSignIn = (status, user) => {
    setIsAuthenticated(status);
    setCurrentUser(user);
    const expiry = new Date().getTime() + 30 * 60 * 1000; // 30 minutes
    localStorage.setItem("sessionData", JSON.stringify({ user, expiry }));
    setIsLoading(true); // show loading screen again when signing in
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("sessionData");
  };

  // const addPost = (newPost) => {
  //   setPosts((prevPosts) => [...prevPosts, newPost]);
  // };

  // const addReply = (newReply) => {
  //   setReplies((prevReplies) => [...prevReplies, newReply]);
  // }

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


  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/reddit" /> : <SignIn onSignIn={handleSignIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reddit" element={isAuthenticated ? (
            <div>
              <Header currentUser={currentUser} onSignOut={handleSignOut} />
              <NewPostForm addPost={addPost} user={currentUser} />
              <PostList posts={posts} replies={replies} deletePost={deletePost} editPost={editPost} addReply={addReply} deleteReply={deleteReply} editReply={editReply} currentUser={currentUser} />
            </div>
          ) : (
            <Navigate to="/" />
          )} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
