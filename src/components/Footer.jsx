const Footer = () => {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-900 py-6">
      <div className="container mx-auto text-center text-zinc-700 dark:text-zinc-300">
        <p>
          &copy; {new Date().getFullYear()} EchoHire AI. All rights reserved.
        </p>
        <p>
          made by{" "}
          <a
            href="https://github.com/keshrirohan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Rohan Keshri
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
