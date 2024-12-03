import "./NewsFeed.css";
import Post from "./../Post/Post.jsx";
import { useEffect, useState } from "react";
import data from "../../../public/Post.json";
import Timer from "../Timer/Timer.jsx";
// import { Link } from "react-router-dom";
// import '../Timer/Timer.js';
// import '../Timer/Timer.css';

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setPosts(data.postData);
  }, []);

  return (
    <>
      <div className="container">
        <div className="notice border mb-4">
          <Timer />
        </div>
      </div>

      {posts.map((e) => (
        <div key={e.id}>
          {/* <Link to={`/post/${e.id}`}> */}
          <Post
            id={e.id}
            user={e.user}
            date={e.date}
            time={e.time}
            caption={e.caption}
            img={e.img}
            video={e.video}
            initialLike={e.like}
            initialShare={e.share}
          />
          {/* </Link> */}
        </div>
      ))}
    </>
  );
};

export default NewsFeed;
