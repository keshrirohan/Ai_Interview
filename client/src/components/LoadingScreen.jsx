import loadingAnimation from "../../public/loading.gif";
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <img src={loadingAnimation} alt="Loading..." />
    </div>
  );
};

export default LoadingScreen;
