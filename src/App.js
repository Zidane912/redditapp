// src/App.js
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import PostList from "./components/PostList";
import NewPostForm from "./components/NewPostForm";
import axios from "axios";
import "./App.css";

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const readData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/read");
        if (response.status === 200) {
          // response.data.forEach(function(post) {
          //   posts.append
          // })
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      
    };
    readData();

  }, []); // this means that it only runs once when mounted

  const addPost = (post) => {
    setPosts([...posts, post]);
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  }

  // deletePost prop, make the func here

  return (
    <div className="App">
      <Header />
      <NewPostForm addPost={addPost} />
      <PostList posts={posts} deletePost={deletePost} />
    </div>
  );
};

export default App;
