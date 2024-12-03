import "./Profile.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import userImage from "../../../public/user.jpg";
import flwr1 from "../../../public/followerImg/flwr1.jpg";
import flwr2 from "../../../public/followerImg/flwr2.jpg";
import flwr3 from "../../../public/followerImg/flwr3.jpg";
import flwr4 from "../../../public/followerImg/flwr4.jpg";
import { TbMessageDots } from "react-icons/tb";
import data from "../../../public/Post.json";
import { useState } from "react";
import { useEffect } from "react";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setPosts(data.postData);
  }, []);
  // Total post from last ID
  const totalPost = data.postData[0]?.id;
  // max follower
  const follower = Math.max(...data.postData.map(e => e.like));

  // handlefollowClick
  const [follow, setFollow] = useState(false);
  const handlefollowClick = () => {
    setFollow(!follow);
  };
  // number format
  function formatNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
  }

  return (
    <>
      <div className="container">
        <div className="topNavbar"></div>
        <div className="profileImg flex justify-center pb-5 pt-5">
          <label htmlFor="userImg">
            <div className="avatar">
              <div className="w-40 rounded-full ring-green-400 ring-offset-base-100 ring-2 ring-offset-1">
                <LazyLoadImage effect="blur" src={userImage} alt="userImg" />
              </div>
            </div>
          </label>
          {/* expanded userImg*/}
          <input type="checkbox" id="userImg" className="modal-toggle" />
          <div className="modal" role="dialog">
            <div className="modal-box">
              <LazyLoadImage effect="blur" src={userImage} alt="userImg" />
            </div>
            <label className="modal-backdrop" htmlFor="userImg">
              Close
            </label>
          </div>
        </div>
        <h2 className="userName font-bold text-center text-2xl text-[#fff] font-sans pb-4">
          Yasin Arafat Ajad
        </h2>
        <div className="followerSection flex justify-center pb-4">
          <div className="avatar-group -space-x-5 rtl:space-x-reverse">
            <div className="avatar">
              <div className="w-12">
                <LazyLoadImage effect="blur" src={flwr1} alt="follwerImg" />
              </div>
            </div>
            <div className="avatar">
              <div className="w-12">
                <LazyLoadImage effect="blur" src={flwr2} alt="follwerImg" />
              </div>
            </div>
            <div className="avatar">
              <div className="w-12">
                <LazyLoadImage effect="blur" src={flwr3} alt="follwerImg" />
              </div>
            </div>
            <div className="avatar">
              <div className="w-12">
                <LazyLoadImage effect="blur" src={flwr4} alt="follwerImg" />
              </div>
            </div>
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-12">
                <span>+99</span>
              </div>
            </div>
          </div>
        </div>
        <div className="connectSection flex justify-center items-center gap-6 pb-4">
          <a href="mailto:yasinarafatazad173@gmail.com" target="_blank">
            <button className="btn btn-ghost border border-[#323232] dark:border-[#fbfcfc] text-[#323232] dark:text-white  rounded-full h-fit px-6">
              <TbMessageDots size={25} />
              Message
            </button>{" "}
          </a>

          {follow ? (
            <button
              onClick={handlefollowClick}
              className="btn btn-ghost border border-[#323232] dark:border-[#fbfcfc] text-[#323232] dark:text-white rounded-full h-fit px-8"
            >
              Followed
            </button>
          ) : (
            <button
              onClick={handlefollowClick}
              className="btn btn-error border border-[#ff5861] rounded-full h-fit px-8"
            >
              Follow
            </button>
          )}
        </div>
        <div className="overvewSection flex justify-center items-center gap-6 pb-4">
          <div className="flwrOvervew border min-w-[6rem] p-4 rounded-lg text-black dark:text-white text-center">
            <h4 className="overewNumber font-bold text-xl pb-2">{formatNumber(follower)}</h4>
            <p className="overvewLabel text-xs font-thin ">Followers</p>
          </div>
          <div className="postOvervew border min-w-[6rem] p-4 rounded-lg text-black dark:text-white text-center">
            <h4 className="overewNumber font-bold text-xl pb-2">{totalPost}</h4>
            <p className="overvewLabel text-xs font-thin ">Posts</p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="gallery flex flex-wrap items-center gap-3 pb-4">
          {posts.map((e) => (
            <div key={e.id} className="avatar ">
              <div className="w-[6.6rem] sm:w-36 rounded ">
                <LazyLoadImage
                  effect="blur"
                  src={e.img}
                  alt=""
                  className="rounded "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
