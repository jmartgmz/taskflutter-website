import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  CheckCircle2,
  Home,
  ListTodo,
  LogOut,
  Menu,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';

interface HeaderProps {
  activePage?: 'home' | 'tasks' | 'completed' | 'shop';
  userPicture?: string | null;
  userName?: string | null;
}

export function Header({ activePage, userPicture, userName }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth0();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };
  return (
    <header className="bg-linear-to-r from-purple-600 via-purple-500 to-pink-500 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-size-[200%_100%] animate-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span
              className="text-2xl group-hover:scale-110 transition-transform"
              style={{ filter: 'brightness(0) invert(1)' }}
            >
              🦋
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white group-hover:scale-105 transition-transform">
              TaskFlutter
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 ml-auto">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
                activePage === 'home'
                  ? 'text-white font-semibold bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">HOME</span>
            </Link>
            <Link
              to="/tasks"
              className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
                activePage === 'tasks'
                  ? 'text-white font-semibold bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <ListTodo className="w-5 h-5" />
              <span className="font-medium">TASKS</span>
            </Link>
            <Link
              to="/completed"
              className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
                activePage === 'completed'
                  ? 'text-white font-semibold bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">COMPLETED</span>
            </Link>
            <Link
              to="/shop"
              className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
                activePage === 'shop'
                  ? 'text-white font-semibold bg-white/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">SHOP</span>
            </Link>
          </nav>

          {/* Desktop User Button with Dropdown Menu */}
          <div className="hidden lg:block ml-2 relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 text-white/90 hover:text-white transition-all"
            >
              <User className="w-5 h-5" />
              <span>ACCOUNT</span>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-5 w-64 bg-white rounded shadow-xl py-1 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  {userPicture ? (
                    <img
                      src={userPicture}
                      alt={userName || 'User'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                      <span className="text-lg font-bold text-purple-600">
                        {userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Manage your account
                    </p>
                  </div>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-purple-50 transition-colors"
                >
                  <User className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Profile Settings</span>
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Log Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden ml-auto p-2 text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden border-t border-white/20 py-4"
          >
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                  activePage === 'home'
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">HOME</span>
              </Link>
              <Link
                to="/tasks"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                  activePage === 'tasks'
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ListTodo className="w-5 h-5" />
                <span className="font-medium">TASKS</span>
              </Link>
              <Link
                to="/completed"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                  activePage === 'completed'
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">COMPLETED</span>
              </Link>
              <Link
                to="/shop"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                  activePage === 'shop'
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">SHOP</span>
              </Link>

              {/* Mobile User Section */}
              <div className="mt-2 pt-4 border-t border-white/20">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  {userPicture ? (
                    <img
                      src={userPicture}
                      alt={userName || 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50">
                      <span className="text-base font-bold text-white">
                        {userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {userName || 'User'}
                    </p>
                    <p className="text-xs text-white/70">Manage your account</p>
                  </div>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-white/10 hover:text-white rounded transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white/90 hover:bg-white/10 hover:text-white rounded transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
