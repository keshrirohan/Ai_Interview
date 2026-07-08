import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Navbar />

      <section className="h-screen flex items-center justify-center">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-white">
          EchoHire AI
        </h1>
      </section>
    </div>
  );
}

export default App;
