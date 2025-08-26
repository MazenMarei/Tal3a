import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, User, ChevronDown, LogOut, UserCircle, Bell } from 'lucide-react';
import logoImage from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const { notifications } = useNotifications();

  // Calculate unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsNotificationDropdownOpen(false); // Close notification dropdown if open
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsProfileDropdownOpen(false); // Close profile dropdown if open
  };

  const handleSignOut = () => {
    setIsProfileDropdownOpen(false);
  };

  const headerVariants = {
    hidden: { y: -80, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const navItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeInOut"
      }
    }
  };

  const dropdownItemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const mobileNavItemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    }
  };

  return (
    <div className="bg-gray-50">
      <motion.header 
        className="bg-white shadow-lg border-b border-green-100 text-gray-800 px-6 h-16 fixed top-0 left-0 right-0 z-50 w-full"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <motion.div 
            className="flex items-center md:hidden mr-4"
            variants={navItemVariants}
          >
            <motion.button 
              onClick={toggleMenu} 
              aria-label="Navigation menu"
              className="p-2 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="h-6 w-6 text-green-600 hover:text-green-700 transition-colors" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu className="h-6 w-6 text-green-600 hover:text-green-700 transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
          <motion.div 
            className="flex items-center"
            variants={navItemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/">
              <img
                src={logoImage}
                alt="Tal3a Logo"
                className="w-32 h-auto object-contain mx-auto cursor-pointer"
              />
            </Link>
          </motion.div>
          <motion.nav 
            className="hidden md:flex items-center justify-center flex-1 max-w-md mx-16"
            variants={navItemVariants}
          >
            {[
              { text: "Groups", to: "/groups" },
              { text: "Events", to: "/events" },
              { text: "Map", to: "/map" },
              { text: "Profile", to: "/profile" }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="flex-1 flex justify-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ 
                  y: -2,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <Link
                  to={item.to}
                  className="text-green-600 hover:text-green-700 transition-colors text-md font-medium px-3 py-2 rounded-lg hover:bg-green-50"
                >
                  {item.text}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
          <motion.div 
            className="flex items-center space-x-4 ml-auto"
            variants={navItemVariants}
          >
            <motion.div 
              className="relative hidden md:block"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "16rem", opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-50 text-gray-800 px-4 py-2 pr-10 pl-4 rounded-full border border-gray-200 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100 text-sm w-64 transition-all"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </motion.div>
            <motion.div
              className="relative"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            >
              <motion.button
                onClick={toggleNotificationDropdown}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 px-3 py-2 rounded-full transition-colors cursor-pointer relative"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-5 w-5 text-white" />
                {unreadCount > 0 && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-green-100 text-green-700 text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
                <motion.div
                  animate={{ rotate: isNotificationDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-white" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {isNotificationDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-green-100 py-2 z-60"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.div variants={dropdownItemVariants}>
                      <Link
                        to="/notifications"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        onClick={() => setIsNotificationDropdownOpen(false)}
                      >
                        <Bell className="h-5 w-5" />
                        <span className="font-medium">Notifications</span>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            >
              <motion.button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 px-3 py-2 rounded-full transition-colors cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-5 w-5 text-white" />
                <motion.div
                  animate={{ rotate: isProfileDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-white" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-green-100 py-2 z-60"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.div variants={dropdownItemVariants}>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <UserCircle className="h-5 w-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </motion.div>
                    <motion.div variants={dropdownItemVariants}>
                      <Link
                        to="/"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden bg-white text-gray-800 px-6 py-4 absolute top-16 left-0 w-full z-10 shadow-xl border-t border-green-100 overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <nav className="flex flex-col space-y-2">
                {[
                  { text: "Groups", to: "/groups" },
                  { text: "Events", to: "/events" },
                  { text: "Activities", to: "/activities" },
                  { text: "Map", to: "/map" },
                  { text: "Notifications", to: "/notifications" }
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    variants={mobileNavItemVariants}
                    whileHover={{ 
                      x: 8,
                      backgroundColor: "rgba(34, 197, 94, 0.05)"
                    }}
                  >
                    <Link
                      to={item.to}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors text-md font-medium py-3 px-4 rounded-lg block w-full text-left cursor-pointer"
                      onClick={toggleMenu}
                    >
                      {item.text}
                    </Link>
                  </motion.div>
                ))}
                <motion.div 
                  className="relative mt-4 pt-4 border-t border-green-100"
                  variants={mobileNavItemVariants}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-50 text-gray-800 px-4 py-3 pr-10 pl-4 rounded-full border border-gray-200 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100 text-sm w-full transition-all"
                  />
                  <Search className="absolute right-3 top-7 h-4 w-4 text-gray-400" />
                </motion.div>
                <motion.div
                  variants={mobileNavItemVariants}
                  whileHover={{ 
                    x: 8,
                    backgroundColor: "rgba(34, 197, 94, 0.05)"
                  }}
                >
                  <Link
                    to="/profile"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors text-md font-medium py-3 px-4 rounded-lg block w-full text-left cursor-pointer"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                </motion.div>
                <motion.div
                  variants={mobileNavItemVariants}
                  whileHover={{ 
                    x: 8,
                    backgroundColor: "rgba(239, 68, 68, 0.05)"
                  }}
                >
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-md font-medium py-3 px-4 rounded-lg block w-full text-left cursor-pointer"
                  >
                    Sign Out
                  </button>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
};

export default NavBar;