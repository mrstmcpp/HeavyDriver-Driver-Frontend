import { useTheme } from "../contexts/ThemeContext.jsx";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer
      className={`mt-auto bg-gradient-to-r 
  from-gray-100 via-gray-200 to-gray-300 
  dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 
  text-gray-900 dark:text-yellow-400 
  border-t border-gray-400 dark:border-yellow-600/30 
  shadow-[0_-4px_12px_rgba(255,215,0,0.1)] 
  transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Copyright */}
        <p className="text-sm tracking-wide opacity-90">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">HeavyDriver</span>. All rights
          reserved.
        </p>

        {/* Right: Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/mrstmcpp"
            className="hover:text-yellow-300 dark:hover:text-gray-700 transition-colors text-sm flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-linkedin text-sm"></i> LinkedIn
          </a>
          <a
            href="https://github.com/mrstmcpp"
            className="hover:text-yellow-300 dark:hover:text-gray-700 transition-colors text-sm flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-github text-sm"></i> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
