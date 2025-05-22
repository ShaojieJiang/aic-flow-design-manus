import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
        id="user-menu-button"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
      >
        <span className="sr-only">Open user menu</span>
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
          JD
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow"
          id="dropdown-user"
        >
          <div className="px-4 py-3" role="none">
            <p className="text-sm text-gray-900" role="none">
              John Doe
            </p>
            <p className="text-sm font-medium text-gray-900 truncate" role="none">
              john.doe@example.com
            </p>
          </div>
          <ul className="py-1" role="none">
            <li>
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
