import { Instagram, Twitter, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

function AppFooter() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between">
        {/* Brand / Name */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">Fuel Price Directory</h3>
          <p className="text-sm text-gray-400">
            Stay updated with real-time fuel prices near you.
          </p>
        </div>

        {/* Social + Feedback Icons */}
        <div className="flex space-x-6 items-center">
          <a
            href="https://instagram.com/fuelpricedirectory"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://x.com/fuelprice_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <Twitter size={20} />
          </a>
          <a
            href="mailto:fuelpricedirectory@proton.me"
            className="hover:text-blue-400 transition"
          >
            <Mail size={20} />
          </a>
          <Link
            to="/feedback"
            className="hover:text-blue-400 transition flex items-center space-x-1"
          >
            <MessageSquare size={20} />
            <span className="hidden sm:inline text-sm">Feedback</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Fuel Price Directory. All rights reserved.
      </div>
    </footer>
  );
}

export default AppFooter;
