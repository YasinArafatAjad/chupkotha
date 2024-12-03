/* eslint-disable react/no-unescaped-entities */
import "./Timer.css";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import comeImg from "../../../public/asset/coming.png";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Timer = () => {
  return (
    <>
      <div className="noticeWarning flex justify-center">
        <LazyLoadImage
          effect="blur"
          src={comeImg}
          alt="coming"
          className="h-20 -rota te-12 mt-2"
        />
      </div>
      <h1 className="text-center py-2 dark:text-[#fff]">
        It's going to happen a big change here.
      </h1>
      <FlipClockCountdown
        to={"2024/12/10"}
        labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
        labelStyle={{
          fontSize: "0.8rem",
          fontWeight: 500,
          textTransform: "uppercase",
        }}
        digitBlockStyle={{
          width: 25,
          height: 40,
          fontSize: 30,
          background: "#323232",
        }}
        dividerStyle={{ color: "white", height: 1 }}
        separatorStyle={{ color: "red", size: "5px" }}
        showSeparators={false}
        duration={0.5}
      >
        Finished
      </FlipClockCountdown>
    </>
  );
};

export default Timer;
