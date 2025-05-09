import React, { useContext, useState } from 'react';
import { Link, useLocation,useNavigate} from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
    const handleCartClick = (e) => {
    setIsMenuOpen(false);
    if (!isAuthenticated) {
      e.preventDefault();
      toast.info('Please log in to view your cart.');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  };

  return (
    <header className="header">
      <nav className="header__nav container">
        <Link to="/" className="header__logo">
          Wedding Planner
        </Link>
        <button
          className="header__menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className={`header__links ${isMenuOpen ? 'header__links--open' : ''}`}>
          {!isAuthenticated && (
            <Link
              to="/login"
              className={`header__link header__log-btn ${location.pathname === '/login' ? 'header__link--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
          <Link
            to="/"
            className={`header__link ${location.pathname === '/' ? 'header__link--active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/venues"
            className={`header__link ${location.pathname === '/venues' ? 'header__link--active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Venues
          </Link>
          <Link
            to="/dishes"
            className={`header__link ${location.pathname === '/dishes' ? 'header__link--active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Dishes
          </Link>
          <Link
            to="/decorations"
            className={`header__link ${location.pathname === '/decorations' ? 'header__link--active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Decorations
          </Link>
          <Link
            to="/contact"
            className={`header__link ${location.pathname === '/contact' ? 'header__link--active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        <Link
          to="/cart"
          className={`header__link ${location.pathname === '/cart' ? 'header__link--active' : ''}`}
          onClick={handleCartClick}
        >
          <ShoppingCart />
        </Link>
          {isAuthenticated && (
            <button
              className="header__link header__log-btn"
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;