import React, { useState } from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to track the mobile menu
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true,
    },
    {
      name: 'Login',
      slug: '/login',
      active: !authStatus,
    },
    {
      name: 'Signup',
      slug: '/signup',
      active: !authStatus,
    },
    {
      name: 'All Posts',
      slug: '/all-posts',
      active: authStatus,
    },
    {
      name: 'Add Post',
      slug: '/add-post',
      active: authStatus,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle the state
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <Container>
        <nav className="flex items-center justify-between py-4">
          <div className="mr-4">
            <Link to="/">
              <Logo width="70px" />
            </Link>
          </div>
          {/* Desktop Navigation (Hidden on Small Screens) */}
          <ul className="hidden md:flex space-x-8 ml-auto text-gray-600 font-medium">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-6 py-2 rounded-lg hover:bg-gray-200 duration-200"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
          {/* Mobile Navigation (Visible on Small Screens) */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700 p-2"
              onClick={toggleMobileMenu} // Trigger the menu toggle
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col space-y-4 mt-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            {navItems.map(
              (item) =>
                item.active && (
                  <Link
                    key={item.name}
                    to={item.slug}
                    className="block px-6 py-2 hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)} // Close the menu after navigation
                  >
                    {item.name}
                  </Link>
                )
            )}
            {authStatus && (
              <div>
                <LogoutBtn />
              </div>
            )}
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;
