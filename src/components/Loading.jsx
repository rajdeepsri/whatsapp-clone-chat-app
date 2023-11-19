import Lottie from "lottie-react";
import loadingAnim from "../lottie/loading1.json";

const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
      }}
    >
      <Lottie
        animationData={loadingAnim}
        loop={true}
        style={{ height: "10rem" }}
      />
    </div>
  );
};

export default Loading;
