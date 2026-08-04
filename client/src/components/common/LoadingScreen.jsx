/**
 * LoadingScreen.jsx
 *
 * Full-screen loading spinner shown while async operations complete.
 * Used by PrivateRoutes (during auth check) and Interview.jsx (during
 * interview + first question fetch).
 *
 * Uses the loading.gif from /public — no props required.
 */

import loadingAnimation from "../../../public/loading.gif";
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <img src={loadingAnimation} alt="Loading..." />
    </div>
  );
};

export default LoadingScreen;
