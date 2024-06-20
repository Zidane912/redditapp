// src/App.js
import React, { useState } from "react";
import Header from "./components/Header";
import PostList from "./components/PostList";
import NewPostForm from "./components/NewPostForm";
import "./App.css";

const App = () => {
  const [posts, setPosts] = useState([]);

  const addPost = (post) => {
    setPosts([...posts, { ...post, id: posts.length + 1 }]);
  };

  return (
    <div className="App">
      <Header />
      <NewPostForm addPost={addPost} />
      <PostList posts={posts} />
    </div>
  );
};

export default App;
