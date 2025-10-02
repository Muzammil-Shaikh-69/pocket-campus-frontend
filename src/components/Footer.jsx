export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-700 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-white flex items-center justify-between">
        <div className="text-left">
          <p>© 2025 Pocket Campus</p>
          <p className="mt-0.5">
            Check out the source code on{" "}
            <a
              href="https://github.com/YourGitHubUsername/Pocket-Campus"
              className="text-gray-300 underline hover:text-white transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
        <p className="text-right">
          Developed by <span className="font-semibold">Muzammil Shaikh</span>.
        </p>
      </div>
    </footer>
  );
}
