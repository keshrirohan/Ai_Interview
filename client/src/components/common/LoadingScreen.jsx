/**
 * LoadingScreen.jsx
 *
 * Full-screen loading spinner shown while async operations complete.
 * Used by PrivateRoutes (during auth check) and Interview.jsx (during
 * interview + first question fetch).
 *
 * Why /loading.gif instead of a relative import:
 *   Files in /public are served as-is by Vite at their root URL.
 *   Importing via a relative path works but is fragile — moving this
 *   component to a different folder would silently break the path.
 *   Using the public URL is the idiomatic Vite approach and never breaks.
 */

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <img src="/loading.gif" alt="Loading..." />
    </div>
  );
};

export default LoadingScreen;
