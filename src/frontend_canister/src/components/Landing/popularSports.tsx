import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const PopularSports = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sports = [
    {
      id: 1,
      name: "RUNNING",
      category: "CARDIOVASCULAR FITNESS",
      description:
        "Join the Egyptian running community and discover new routes throughout the country.",
      image:
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      participants: "2.5K+",
      events: "45 Events",
      gradient: "from-white via-green-50 to-green-100",
      accent: "green-500",
      accentHover: "green-600",
      glowColor: "rgba(34, 197, 94, 0.2)",
    },
    {
      id: 2,
      name: "FITNESS",
      category: "STRENGTH TRAINING",
      description:
        "Discover local gyms and participate in fitness challenges with professional trainers.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      participants: "3.4K+",
      events: "32 Events",
      gradient: "from-white via-green-50 to-green-100",
      accent: "green-500",
      accentHover: "green-600",
      glowColor: "rgba(34, 197, 94, 0.2)",
    },
    {
      id: 3,
      name: "CYCLING",
      category: "OUTDOOR SPORTS",
      description:
        "Explore Egypt on two wheels with organized cycling groups and safe routes and exciting trails.",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      participants: "3.2K+",
      events: "28 Events",
      gradient: "from-white via-green-50 to-green-100",
      accent: "green-500",
      accentHover: "green-600",
      glowColor: "rgba(34, 197, 94, 0.2)",
    },
  ];

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
      <motion.div
        className="absolute top-20 right-10 w-[30rem] h-[30rem] bg-gradient-to-br from-green-100/40 via-green-50/60 to-transparent rounded-full blur-3xl"
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
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tl from-green-100/50 via-green-50/70 to-transparent rounded-full blur-3xl"
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
      <motion.div
        className="absolute top-1/3 right-20 w-32 h-32 border-2 border-green-200/40 rounded-3xl backdrop-blur-sm"
        variants={floatingVariants}
        animate="animate"
      />

      <motion.div
        className="absolute bottom-1/3 left-20 w-24 h-24 border-2 border-green-200/50 rounded-2xl backdrop-blur-sm"
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
      <motion.div
        className="absolute top-1/4 left-16 w-28 h-28 bg-gradient-to-br from-green-100/90 to-green-50/60 rounded-full backdrop-blur-sm border border-green-200/30"
        animate={{
          y: [-25, 25, -25],
          x: [-10, 10, -10],
          rotate: [0, 360],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-16 w-20 h-20 bg-gradient-to-tl from-green-100/80 to-green-50/70 rounded-2xl backdrop-blur-sm border border-green-200/40"
        animate={{
          rotate: [45, -315],
          scale: [1, 1.3, 1],
          x: [-20, 20, -20],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-20" variants={headerVariants}>
          <motion.h2
            className="text-3xl lg:text-4xl font-black text-gray-900 mb-8 leading-tight"
            variants={headerVariants}
          >
            POPULAR{" "}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-green-600 to-green-500"
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
              SPORTS
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            JOIN THOUSANDS OF ATHLETES IN EGYPT AND DISCOVER YOUR FAVORITE SPORT
            WITH ACTIVE COMMUNITIES AND ORGANIZED EVENTS
          </motion.p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-20"
          variants={sectionVariants}
        >
          {sports.map((sport, index) => (
            <motion.div
              key={sport.id}
              className="group relative"
              variants={cardVariants}
              layout
              initial="hidden"
              animate="visible"
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{
                y: -20,
                scale: 1.02,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                },
              }}
            >
              {/* Enhanced 3D glow effect */}
              <motion.div
                className="absolute -inset-6 rounded-3xl opacity-0 blur-2xl"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${sport.glowColor}, transparent 70%)`,
                }}
                animate={{
                  opacity: hoveredCard === index ? 1 : 0,
                  scale: hoveredCard === index ? 1.2 : 1,
                }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden min-h-[580px]"
                style={{
                  backdropFilter: "blur(20px)",
                  background: "rgba(255, 255, 255, 0.85)",
                }}
                whileHover={{
                  boxShadow: `0 25px 50px -12px ${sport.glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.1)`,
                  background: "rgba(255, 255, 255, 0.95)",
                  y: -2,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    src={sport.image}
                    alt={sport.name}
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

                  {/* Top badges with enhanced styling */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <motion.span
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg"
                      initial={{ scale: 0, opacity: 0, y: -20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.6 + index * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{
                        scale: 1.1,
                        y: -2,
                        boxShadow: `0 8px 25px ${sport.glowColor}`,
                      }}
                    >
                      {sport.category}
                    </motion.span>

                    <motion.div
                      className="bg-white/30 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm font-bold border border-white/40 shadow-lg"
                      initial={{ scale: 0, opacity: 0, y: -20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.8 + index * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        scale: 1.05,
                        y: -2,
                      }}
                    >
                      {sport.participants} Members
                    </motion.div>
                  </div>

                  {/* Enhanced events badge */}
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg absolute bottom-6 right-6"
                    initial={{ y: 30, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{
                      delay: 1.2 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.1,
                      y: -3,
                      boxShadow: `0 8px 25px ${sport.glowColor}`,
                    }}
                  >
                    {sport.events}
                  </motion.div>

                  {/* Enhanced accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-600"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: hoveredCard === index ? 1 : 0,
                      height: hoveredCard === index ? 8 : 2,
                    }}
                    style={{ transformOrigin: "left" }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />
                </div>

                {/* Enhanced content section */}
                <div className="p-8 lg:p-10">
                  <motion.div
                    className="space-y-6"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  >
                    <div>
                      <motion.h3
                        className="text-1xl lg:text-1xl font-black text-gray-900 mb-3"
                        whileHover={{
                          color: "#22c55e",
                          x: 5,
                          scale: 1.02,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {sport.name}
                      </motion.h3>
                      <motion.p
                        className="text-lg font-bold text-green-500 opacity-80"
                        whileHover={{
                          opacity: 1,
                          scale: 1.02,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {sport.category}
                      </motion.p>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-lg">
                      {sport.description}
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
                        className="group inline-flex items-center gap-4 text-lg font-bold text-green-500 hover:text-green-600 transition-all duration-300 cursor-pointer"
                        whileHover={{
                          x: 10,
                          scale: 1.05,
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <motion.div
                          className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xl cursor-pointer"
                          animate={{
                            x: hoveredCard === index ? 8 : 0,
                            rotate: hoveredCard === index ? 90 : 0,
                            scale: hoveredCard === index ? 1.2 : 1,
                          }}
                          transition={{ duration: 0.3, type: "spring" }}
                          whileHover={{
                            backgroundColor: "rgba(34, 197, 94, 0.15)",
                            borderColor: "rgba(34, 197, 94, 0.5)",
                            boxShadow: `0 8px 25px ${sport.glowColor}`,
                            scale: 1.3,
                          }}
                        >
                          →
                        </motion.div>
                        <span className="text-xl">EXPLORE EVENTS</span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Enhanced 3D hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 pointer-events-none rounded-3xl"
                  transition={{ duration: 0.3 }}
                />

                {/* Enhanced circular hover effect */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-green-500/10 rounded-full opacity-0"
                  animate={{
                    scale: hoveredCard === index ? 8 : 0,
                    opacity: hoveredCard === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          {[
            { number: "7.5K+", label: "Active Members", color: "green" },
            { number: "105", label: "Monthly Events", color: "green" },
            { number: "15+", label: "Different Sports", color: "green" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="group text-center relative"
              whileHover={{
                y: -8,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              {/* Stat glow */}
              <motion.div
                className="absolute inset-0 bg-green-200/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-xl"
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 20px 40px rgba(34, 197, 94, 0.15)",
                }}
              >
                <motion.h4
                  className="text-1xl lg:text-2xl font-black text-green-500 mb-2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 2.4 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{
                    scale: 1.1,
                    y: -2,
                  }}
                >
                  {stat.number}
                </motion.h4>
                <motion.p
                  className="text-gray-600 text-base font-semibold"
                  whileHover={{ color: "#374151" }}
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PopularSports;
