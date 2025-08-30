import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import LogoImage from "@/assets/images/logo.png";
import { Link } from "react-router-dom";

const NavBar = () => {
  const headerVariants: Variants = {
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

  const navItemVariants: Variants = {
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

  return (
    <div className="bg-gray-50">
      <motion.header
        className="bg-white shadow-lg border-b border-green-100 text-gray-800 px-6 h-16 flex items-center justify-center fixed top-0 left-0 right-0 z-50 w-full"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="absolute left-6" variants={navItemVariants}>
          <Link to="/">
            <motion.div
              className="p-2 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="h-6 w-6 text-green-600 hover:text-green-700 transition-colors" />
            </motion.div>
          </Link>
        </motion.div>
        <motion.div
          className="flex items-center"
          variants={navItemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link to="/">
            <img
              src={LogoImage}
              alt="Tal3a Logo"
              className="w-32 h-auto object-contain mx-auto cursor-pointer"
            />
          </Link>
        </motion.div>
        <motion.div
          className="absolute right-6"
          variants={navItemVariants}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        ></motion.div>
      </motion.header>
    </div>
  );
};

export default NavBar;
