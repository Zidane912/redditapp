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
    const readPostData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/read");
        if (response.status === 200) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    readPostData();

    const readReplyData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/reply/read");
        if (response.status === 200) {
          console.log(replies);
          setReplies(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };


    readPostData();
    readReplyData();

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

  const editPost = (editedPost) => {
    setPosts(posts.map(post => post.id === editedPost.id ? editedPost : post));
  };

  return (
    <div className="App">
      <Header />
      <NewPostForm addPost={addPost} />
      <PostList posts={posts} replies={replies} deletePost={deletePost} editPost={editPost} addReply={addReply} />
    </div>
  );
};

export default App;
