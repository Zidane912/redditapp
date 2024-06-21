import React, { useEffect } from "react";
import Post from "./Post";
import axios from "axios";


const PostList = ({ posts }) => {

  const readData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/read");
      if (response.status === 200) {
        // response.data.forEach(function(post) {
        //   posts.append
        // })
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    readData();
  }, []);

  // cannot simply do readData() to test, will loop infinitley


  return (
    <div className="post-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
