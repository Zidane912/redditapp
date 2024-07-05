import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import PostList from "./components/PostList";
import NewPostForm from "./components/NewPostForm";
import axios from "axios";
import "./App.css";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
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

    readData("readPosts", setPosts);
    readData("readReplies", setReplies);

  }, []);

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
    <div className="App">
      <Header />
      <NewPostForm addPost={addPost} />
      <PostList posts={posts} replies={replies} deletePost={deletePost} editPost={editPost} addReply={addReply} deleteReply={deleteReply} editReply={editReply} />
    </div>
  );
};

export default App;
