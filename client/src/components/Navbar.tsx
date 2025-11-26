import React from 'react';
import { Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-purple-600" fill="currentColor" />
              <span className="text-xl font-bold text-gray-900">PDFly</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Blog
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Help
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Pricing
              </a>
            </div>
          </div>
          {/* <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Sign up free →
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;