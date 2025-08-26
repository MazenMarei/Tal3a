import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const textVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const statItemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.8 },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatingVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="bg-gray-50">
      <motion.section 
        className="relative min-h-screen w-full mt-16 overflow-hidden pt-5"
        style={{ 
          background: `
            linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.6) 100%),
            linear-gradient(45deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 50%, rgba(5, 150, 105, 0.1) 100%),
            url('https://images.unsplash.com/photo-1611657291636-c141ee8cf7ab?q=80&w=950&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
        variants={heroVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
      
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 1, duration: 2 }}
        >
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-green-400 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-white rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 opacity-20 rotate-12 animate-pulse"></div>
        </motion.div>

     
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
              <motion.div 
                className="space-y-12 text-center lg:text-left"
                variants={textVariants}
              >
                <div className="space-y-8">
                  <motion.h1 
                    className="text-3xl lg:text-4xl font-black text-white leading-tight"
                    variants={textVariants}
                    style={{
                      textShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    WELCOME TO{' '}
                    <motion.span 
                      className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-emerald-400"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        backgroundSize: '200% 200%'
                      }}
                    >
                      TAL3A
                    </motion.span>
                  </motion.h1>
                  
                  <motion.h2 
                    className="text-2xl lg:text-3xl font-medium text-white/95 leading-relaxed"
                    variants={textVariants}
                    style={{
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    JOIN REAL SPORTS ACTIVITIES IN CITY
                    <br />
                    <span className="text-green-300 font-semibold">DISCOVER PLAY ENJOY</span>
                  </motion.h2>
                </div>

                <motion.div 
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={statsVariants}
                >
                  {[
                    { number: "10K+", label: "Active Users", icon: "👥", color: "from-blue-500 to-blue-600" },
                    { number: "500+", label: "Events", icon: "🏃", color: "from-green-500 to-green-600" },
                    { number: "25+", label: "Cities", icon: "🏙️", color: "from-purple-500 to-purple-600" },
                    { number: "4.9", label: "User Rating", icon: "⭐", color: "from-yellow-500 to-orange-500" }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="relative group"
                      variants={statItemVariants}
                      whileHover={{ 
                        y: -8,
                        transition: { 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 10 
                        }
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl group-hover:bg-white/10 transition-all duration-300">
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-t-2xl`}></div>
                        
                        <motion.div 
                          className="text-2xl mb-3 filter drop-shadow-lg"
                          whileHover={{ 
                            scale: 1.2,
                            rotate: 10
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {stat.icon}
                        </motion.div>
                        
                        <motion.div 
                          className="text-2xl lg:text-2xl font-bold text-white mb-2"
                          style={{
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                          }}
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            delay: 1.5 + index * 0.1,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          {stat.number}
                        </motion.div>
                        
                        <div className="text-sm text-white/80 font-medium">
                          {stat.label}
                        </div>
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div 
                  className="text-center lg:text-left"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.button
                    className="relative group bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 text-xl font-bold rounded-2xl cursor-pointer shadow-2xl overflow-hidden mb-2"
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      transition: { 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 10 
                      }
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: 3, 
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl "></div>
                    <span className="relative z-10 flex items-center justify-center gap-3 h-5">
                      <span className='font-bold px-8 '>JOIN US NOW</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        →
                      </motion.span>
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{
                        delay: 4,
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    ></motion.div>
                  </motion.button>
                </motion.div>
              </motion.div>
              <motion.div className="relative lg:flex justify-center items-center hidden">
                <motion.div
                  className="absolute top-20 left-20"
                  variants={floatingVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 3.5 }}
                >
                  <motion.div
                    className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl"
                    animate={{ 
                      y: [-8, 8, -8],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255, 255, 255, 0.15)"
                    }}
                  >
                    <span className="text-4xl filter drop-shadow-lg">🏀</span>
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="absolute top-40 right-32"
                  variants={floatingVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 4 }}
                >
                  <motion.div
                    className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl"
                    animate={{ 
                      y: [-12, 12, -12],
                      rotate: [0, -8, 8, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255, 255, 255, 0.15)"
                    }}
                  >
                    <span className="text-3xl filter drop-shadow-lg">⚽</span>
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="absolute bottom-32 left-24"
                  variants={floatingVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 4.5 }}
                >
                  <motion.div
                    className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl"
                    animate={{ 
                      x: [-6, 6, -6],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255, 255, 255, 0.15)"
                    }}
                  >
                    <span className="text-2xl filter drop-shadow-lg">🎾</span>
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="absolute bottom-8 right-8"
                  initial={{ y: 100, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 5, 
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <motion.div
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 group cursor-pointer"
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      transition: { 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 10 
                      }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="relative"
                      >
                        <motion.div
                          className="w-5 h-5 bg-green-400 rounded-full shadow-lg"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.7, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        ></motion.div>
                        <motion.div
                          className="absolute inset-0 bg-green-400 rounded-full"
                          animate={{ 
                            scale: [1, 2.5, 1],
                            opacity: [0.5, 0, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        ></motion.div>
                      </motion.div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-lg drop-shadow-md">Active Event Now</span>
                        <span className="text-green-300 text-sm font-medium">15 people online</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        <motion.div
          className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            delay: 6,
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>

        <motion.div 
          className="absolute bottom-32 left-32 w-48 h-48 bg-gradient-to-tl from-blue-400/15 to-green-600/15 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            delay: 6.5,
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/40 rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: `${15 + i * 12}%`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
              y: [-30, 30, -30],
              x: [-15, 15, -15]
            }}
            transition={{ 
              delay: 8 + i * 0.5,
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
        ))}
        <motion.div
          className="absolute inset-0 opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ delay: 2, duration: 3 }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.5, duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col items-center text-white/70 cursor-pointer group"
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{ 
              scale: 1.1,
              color: "rgba(255, 255, 255, 0.9)"
            }}
          >
            <span className="text-sm mb-2 group-hover:text-green-300 transition-colors">Explore More</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center group-hover:border-green-300/60 transition-colors">
              <motion.div
                className="w-1 h-3 bg-white/60 rounded-full mt-2 group-hover:bg-green-300 transition-colors"
                animate={{ 
                  y: [0, 12, 0],
                  opacity: [1, 0.3, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Hero;