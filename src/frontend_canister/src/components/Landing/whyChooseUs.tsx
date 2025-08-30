import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Link } from "react-router-dom";
const WhyChoose = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "Advanced Tracking",
      subtitle: "Real-time Performance",
      description:
        "Built on blockchain technology to manage events with transparency and high security.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "",
      gradient: "from-emerald-50 via-emerald-100 to-green-50",
      accent: "emerald-500",
      accentHover: "emerald-600",
      glowColor: "rgba(16, 185, 129, 0.2)",
    },
    {
      title: "Interactive Community",
      subtitle: "Connect and Share",
      description:
        "Connect with like-minded athletes and build lasting sports communities.",
      image:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "",
      gradient: "from-emerald-50 via-emerald-100 to-green-50",
      accent: "emerald-500",
      accentHover: "emerald-600",
      glowColor: "rgba(16, 185, 129, 0.2)",
    },
    {
      title: "Local Focus",
      subtitle: "Events in Your Area",
      description:
        "Specially designed for Egyptian sports enthusiasts with full Arabic language support.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "",
      gradient: "from-emerald-50 via-emerald-100 to-green-50",
      accent: "emerald-500",
      accentHover: "emerald-600",
      glowColor: "rgba(16, 185, 129, 0.2)",
    },
  ];

  // Enhanced animation variants
  const sectionVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants: Variants = {
    hidden: {
      y: 60,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      y: 80,
      opacity: 0,
      scale: 0.9,
      rotateX: 15,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: {
      y: 50,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.5,
      },
    },
  };

  const floatingVariants: Variants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.section
      className="relative bg-gradient-to-br from-white via-gray-50/30 to-white min-h-screen py-20 lg:py-32 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Enhanced background elements */}
      <motion.div
        className="absolute top-20 right-10 w-[30rem] h-[30rem] bg-gradient-to-br from-emerald-100/40 via-green-50/60 to-transparent rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          rotate: [0, 120, 240, 360],
        }}
        transition={{
          delay: 0.5,
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tl from-green-100/50 via-emerald-50/70 to-transparent rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.6, 0.2],
          rotate: [360, 240, 120, 0],
        }}
        transition={{
          delay: 1,
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Modern geometric accents */}
      <motion.div
        className="absolute top-1/3 left-20 w-32 h-32 border-2 border-emerald-200/40 rounded-3xl backdrop-blur-sm"
        variants={floatingVariants}
        animate="animate"
      />

      <motion.div
        className="absolute bottom-1/3 right-20 w-24 h-24 border-2 border-emerald-200/50 rounded-2xl backdrop-blur-sm"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.2, 1],
          y: [-15, 15, -15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <motion.div className="text-center mb-24" variants={headerVariants}>
          <motion.h2
            className="text-3xl lg:text-4xl font-black text-gray-900 mb-8 leading-tight"
            variants={headerVariants}
          >
            WHY CHOOSE{" "}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              TAL3A
            </motion.span>
            ?
          </motion.h2>
          <motion.p
            className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            variants={headerVariants}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            EXPERIENCE THE FUTURE OF SPORTS COMMUNITY MANAGEMENT WITH OUR
            INNOVATIVE PLATFORM DESIGNED FOR MODERN ATHLETES AND SPORTS.
          </motion.p>
        </motion.div>

        {/* Enhanced Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-20"
          variants={sectionVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative perspective-1000"
              variants={cardVariants}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{
                y: -20,
                rotateY: 5,
                scale: 1.02,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                },
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Enhanced 3D glow effect */}
              <motion.div
                className="absolute -inset-6 rounded-3xl opacity-0 blur-2xl"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${feature.glowColor}, transparent 70%)`,
                }}
                animate={{
                  opacity: hoveredCard === index ? 1 : 0,
                  scale: hoveredCard === index ? 1.2 : 1,
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Main card with enhanced glassmorphism */}
              <motion.div
                className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden min-h-[520px]"
                style={{
                  backdropFilter: "blur(20px)",
                  background: "rgba(255, 255, 255, 0.85)",
                }}
                whileHover={{
                  boxShadow:
                    "0 25px 50px -12px rgba(16, 185, 129, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  background: "rgba(255, 255, 255, 0.95)",
                  y: -2,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Image container with parallax effect */}
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    whileHover={{
                      scale: 1.15,
                      filter: "brightness(1.1) contrast(1.1)",
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />

                  {/* Enhanced gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent"
                    whileHover={{
                      background:
                        "linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0.3), transparent)",
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Floating icon with 3D effect */}
                  <motion.div
                    className={`absolute top-8 left-8 w-20 h-20 bg-gradient-to-br ${feature.gradient} backdrop-blur-2xl rounded-3xl border border-white/80 flex items-center justify-center shadow-2xl`}
                    initial={{
                      scale: 0,
                      rotate: -180,
                      y: -50,
                    }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.6 + index * 0.15,
                      duration: 1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    whileHover={{
                      scale: 1.2,
                      rotate: 15,
                      y: -8,
                      boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <motion.span
                      className="text-3xl filter drop-shadow-lg"
                      animate={{
                        rotateY: hoveredCard === index ? [0, 360] : 0,
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      {feature.icon}
                    </motion.span>
                  </motion.div>

                  {/* Modern accent line with wave effect */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-emerald-600`}
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: hoveredCard === index ? 1 : 0,
                      height: hoveredCard === index ? 8 : 2,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>

                {/* Enhanced content section */}
                <div className="p-8 lg:p-10">
                  <motion.div
                    className="space-y-6"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  >
                    <div>
                      <motion.h3
                        className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3"
                        whileHover={{
                          color: "#059669",
                          x: 5,
                          scale: 1.02,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.title}
                      </motion.h3>
                      <motion.p
                        className="text-base font-semibold text-emerald-500 opacity-80"
                        whileHover={{
                          opacity: 1,
                          color: "#059669",
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.subtitle}
                      </motion.p>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-lg">
                      {feature.description}
                    </p>

                    {/* Enhanced CTA button */}
                    <motion.div
                      className="pt-6"
                      initial={{ opacity: 0.7 }}
                      animate={{
                        opacity: hoveredCard === index ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.button
                        className="group inline-flex items-center gap-3 text-lg font-bold text-emerald-500 hover:text-emerald-600 transition-all duration-300 cursor-pointer"
                        whileHover={{
                          x: 10,
                          scale: 1.05,
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        style={{
                          color: hoveredCard === index ? "#059669" : "#10b981",
                        }}
                      >
                        <span>Learn More</span>
                        <motion.div
                          className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-lg cursor-pointer"
                          animate={{
                            x: hoveredCard === index ? 8 : 0,
                            rotate: hoveredCard === index ? 90 : 0,
                            scale: hoveredCard === index ? 1.2 : 1,
                          }}
                          transition={{ duration: 0.3, type: "spring" }}
                          whileHover={{
                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                            borderColor: "rgba(16, 185, 129, 0.5)",
                            boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
                            scale: 1.3,
                          }}
                        >
                          →
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Enhanced 3D hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-transparent to-emerald-100/10 opacity-0 group-hover:opacity-100 pointer-events-none rounded-3xl"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div className="text-center" variants={buttonVariants}>
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-3xl blur-2xl opacity-0"
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.button
              className="relative group bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-6 text-xl font-bold rounded-2xl cursor-pointer shadow-2xl overflow-hidden mb-2"
              whileHover={{
                scale: 1.05,
                y: -2,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                },
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 3,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Enhanced shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                initial={{ x: "-150%" }}
                animate={{ x: "150%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeInOut",
                }}
              />

              <span className="relative z-20 flex items-center justify-center gap-4 h-3">
                <span>EXPLORE NOW</span>
                <motion.span
                  animate={{
                    x: [3, -3, 3],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-emerald-100 text-2xl"
                  whileHover={{
                    x: 8,
                    scale: 1.2,
                    rotate: 15,
                  }}
                >
                  →
                </motion.span>
              </span>

              {/* Button particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/60 rounded-full"
                  style={{
                    top: `${30 + i * 20}%`,
                    left: `${20 + i * 25}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Enhanced floating elements */}
        <motion.div
          className="absolute top-1/4 left-16 w-24 h-24 bg-gradient-to-br from-emerald-100/90 to-emerald-50/90 backdrop-blur-xl rounded-3xl border border-emerald-200/50 shadow-xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.9, 0.7],
            rotate: [0, 90, 180, 270, 360],
            y: [-15, 15, -15],
          }}
          transition={{
            delay: 2,
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-12 w-20 h-20 bg-gradient-to-tl from-emerald-100/90 to-emerald-50/90 backdrop-blur-xl rounded-full border border-emerald-200/60 shadow-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.8, 0.6],
            x: [20, -20, 20],
            rotate: [360, 0],
          }}
          transition={{
            delay: 3,
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Enhanced particle system */}
        <AnimatePresence>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-emerald-400/60 to-emerald-500/60 rounded-full backdrop-blur-sm"
              style={{
                top: `${15 + i * 10}%`,
                left: `${10 + i * 11}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.8, 0],
                opacity: [0, 0.8, 0],
                y: [-25, 25, -25],
                x: [-15, 15, -15],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                delay: 4 + i * 0.3,
                duration: 6 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </AnimatePresence>

        {/* Subtle grid pattern with animation */}
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.02, 0.06, 0.02],
          }}
          transition={{
            delay: 1,
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>
    </motion.section>
  );
};

export default WhyChoose;
