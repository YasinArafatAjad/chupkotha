import { useParams } from "react-router-dom"; // Import useParams to get the post id from URL
import data from "../../../public/Post.json"; // Import post data (adjust the path if needed)

const UniqPost = () => {
  const { id } = useParams(); // Get the post id from the URL
  const post = data.postData.find((p) => p.id === parseInt(id)); // Find the post based on the id

  if (!post) {
    return <p>Post not found</p>; // Show message if the post with this id does not exist
  }

  return (
    <div className="post-details">
      <h1>{post.user}</h1> {/* Display post's user */}
      <p>{post.caption}</p> {/* Display post's caption */}
      {/* Render post image or video */}
      <img src={post.img} alt={`Post ${post.id}`} />
      {post.video && <video controls src={post.video}></video>} {/* Conditionally render video */}
    </div>
  );
};

export default UniqPost;
