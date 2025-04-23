import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const onLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuLinks = (
    <>
      <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Accueil</Link>
      <Link to="/actualites" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Actualités</Link>
      <Link to="/annonces" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Annonces</Link>
      <Link to="/chat" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Chat</Link>
    </>
  );

  const authLinks = (
    <div className="flex space-x-4 items-center">
      {menuLinks}
      <span className="text-gray-300 text-sm">Bienvenue, {user && user.name}</span>
      <button onClick={onLogout} className="text-red-400 hover:text-red-600 text-sm">Déconnexion</button>
    </div>
  );

  const guestLinks = (
    <div className="flex space-x-4 items-center">
      {menuLinks}
      <Link to="/login" className="text-gray-300 hover:text-white text-sm">Connexion</Link>
      <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-500">Inscription</Link>
    </div>
  );

  const mobileMenu = (
    <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1`}>
      {menuLinks}
      {isAuthenticated ? (
        <>
          <span className="block text-gray-300 px-3">Bienvenue, {user && user.name}</span>
          <button onClick={onLogout} className="block text-left text-red-400 hover:text-red-600 px-3">Déconnexion</button>
        </>
      ) : (
        <>
          <Link to="/login" className="block text-gray-300 hover:text-white px-3">Connexion</Link>
          <Link to="/register" className="block text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-md">Inscription</Link>
        </>
      )}
    </div>
  );

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo à gauche */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/ensa.png" alt="ENSA Logo" className="h-8 w-8" />
              <span className="text-white font-bold text-lg">School Blog</span>
            </Link>
          </div>

          {/* Liens au centre (visible uniquement sur desktop) */}
          <div className="hidden md:flex flex-1 justify-center">
            {isAuthenticated ? authLinks : guestLinks}
          </div>

          {/* Menu burger (mobile) à droite */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {mobileMenu}
    </nav>
  );
};

export default Navbar;
