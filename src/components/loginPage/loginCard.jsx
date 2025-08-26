import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Shield, Chrome, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import LogoImage from "../../assets/images/logo.png";
import iiLogo from "../../assets/icons/ii_logo.png";
import nfidLogo from "../../assets/icons/nfid_logo.png";
import { useProfile } from "../../context/ProfileContext";
const LoginCard = () => {
  const { login } = useProfile();
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 sm:py-12 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl"
      >
        <div className="flex w-full h-75 justify-center">
          <img
            src={LogoImage}
            alt="Logo"
            className="object-contain translate-x-[-5%] "
          />
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl"
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 ">
              Login to <span className="text-[#00ba94]">Tal3a</span>
            </h1>
            <motion.div
              variants={itemVariants}
              className="space-y-3 sm:space-y-4"
            >
              {/* Internet Identity Button */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  className="w-full  bg-gradient-to-r from-[#4d19d7] to-[#860eec] hover:from-[#4d278e] hover:to-[#4d278e] text-white font-semibold sm:py-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                  style={{
                    padding: "30px",
                  }}
                  onClick={() => login("ii")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4d19d7] to-[#860eec] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <img
                          src={iiLogo}
                          alt="Internet Identity Logo"
                          className="object-contain w-4 h-2 sm:w-5 sm:h-5"
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-base sm:text-lg">
                          Internet Identity
                        </div>
                        <div className="text-green-100 text-xs sm:text-sm font-normal">
                          Decentralized & Secure
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Button>
              </motion.div>

              {/* NFID Button */}
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  className="w-full bg-gradient-to-r from-[#078675] to-[#078675] hover:from-[#078675] hover:to-[#078675] text-white font-semibold py-4 sm:py-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                  style={{
                    padding: "30px",
                  }}
                  onClick={() => login("nfid")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <img
                          src={nfidLogo}
                          alt="NFID Logo"
                          className="object-contain w-4 h-4 sm:w-5 sm:h-5"
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-base sm:text-lg">
                          NFID
                        </div>
                        <div className="text-blue-100 text-xs sm:text-sm font-normal">
                          Login with Google Account
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Information Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 gap-3 sm:gap-4 mt-6 sm:mt-8"
            >
              <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-800 text-sm">
                      Internet Identity
                    </h4>
                    <p className="text-green-700 text-xs mt-1">
                      Most secure option. Uses blockchain cryptography for
                      authentication without passwords.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Chrome className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 text-sm">
                      NFID + Google
                    </h4>
                    <p className="text-blue-700 text-xs mt-1">
                      Familiar login experience. Use your existing Google
                      account to access Tal3a.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-center pt-3 sm:pt-4"
            >
              <p className="text-xs text-gray-500">
                New to Web3? We recommend starting with{" "}
                <span className="text-blue-600 font-semibold">
                  NFID + Google
                </span>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginCard;
