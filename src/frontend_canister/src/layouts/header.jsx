import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import logoImage from "../assets/images/logo.png";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
        delayChildren: 0.2,
      },
    },
  };

  const navItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
      },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const mobileNavItemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const navItems = [
    { text: "Groups", link: "/groups" },
    { text: "Events", link: "/events" },
    { text: "Map", link: "/map" },
    { text: "Promotions", link: "/promotions" },
  ];

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
            {navItems.map((item, index) => (
              <motion.div
                key={item.text}
                className="flex-1 flex justify-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{
                  y: -2,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
              >
                <Link to={item.link}>
                  <button
                    className={`text-md font-medium px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === item.link
                        ? "text-green-800 bg-green-100 font-semibold"
                        : "text-green-600 hover:text-green-700 hover:bg-green-50"
                    }`}
                    aria-current={
                      location.pathname === item.link ? "page" : undefined
                    }
                  >
                    {item.text}
                  </button>
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
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            >
              <Link to="/login">
                <motion.button
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 ml-3"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  START NOW
                </motion.button>
              </Link>
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
                {navItems.map((item) => (
                  <motion.div
                    key={item.text}
                    variants={mobileNavItemVariants}
                    whileHover={{
                      x: 8,
                      backgroundColor: "rgba(34, 197, 94, 0.05)",
                    }}
                  >
                    <Link to={item.link}>
                      <button
                        className={`text-md font-medium py-3 px-4 rounded-lg block w-full text-left transition-colors ${
                          location.pathname === item.link
                            ? "text-green-800 bg-green-100 font-semibold"
                            : "text-green-600 hover:text-green-700 hover:bg-green-50"
                        }`}
                        onClick={toggleMenu}
                        aria-current={
                          location.pathname === item.link ? "page" : undefined
                        }
                      >
                        {item.text}
                      </button>
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
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
};

export default Header;
