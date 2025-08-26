import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const Community = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Move testimonials array before the useEffect hooks
  const testimonials = [
    {
      id: 1,
      name: "Jasmine Amir",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Tal3a transformed how I find and join football matches. The community is amazing and everyone is welcoming! I've made so many new friends.",
      date: "2 days ago",
      sport: "Football",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-white via-green-50 to-green-100",
      accent: "green-500",
      glowColor: "rgba(34, 197, 94, 0.2)"
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "As a coach, I love how easy it is to organize events and manage participants. The platform is intuitive and reliable with excellent features.",
      date: "1 week ago",
      sport: "Basketball",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-white via-green-50 to-green-100",
      accent: "green-500",
      glowColor: "rgba(34, 197, 94, 0.2)"
    },
    {
      id: 3,
      name: "Fatma Mohamed",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "The app helped me find the perfect yoga group. Now I have new friends and feel healthier than ever! Highly recommend to everyone.",
      date: "3 days ago",
      sport: "Yoga",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-white via-green-50 to-green-100",
      accent: "green-500",
      glowColor: "rgba(34, 197, 94, 0.2)"
    },
    {
      id: 4,
      name: "Omar Khaled",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Swimming events are perfectly organized with professional instructors. The community support keeps me motivated every day!",
      date: "5 days ago",
      sport: "Swimming",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-white via-green-50 to-green-100",
      accent: "green-500",
      glowColor: "rgba(34, 197, 94, 0.2)"
    },
    {
      id: 5,
      name: "Nour El-Din",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Tennis matches are so much fun! Great way to meet competitive players and improve my game with expert coaching tips.",
      date: "1 week ago",
      sport: "Tennis",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-white via-green-50 to-green-100",
      accent: "green-500",
      glowColor: "rgba(34, 197, 94, 0.2)"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-play testimonials
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

  const stats = [
    { number: "15K+", label: "Happy Athletes", color: "green" },
    { number: "4.9", label: "Average Rating", color: "green" },
    { number: "98%", label: "Satisfaction Rate", color: "green" }
  ];

  const sectionVariants = {
    hidden: { 
      opacity: 0,
      y: 40 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { 
      y: 60, 
      opacity: 0,
      scale: 0.95 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 80, 
      opacity: 0, 
      scale: 0.9,
      rotateX: 15 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleDotClick = (index) => {
    setCurrentTestimonial(index);
    setAutoPlay(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  return (
    <motion.section 
      className="relative bg-gradient-to-br from-white via-gray-50/30 to-white min-h-screen py-20 lg:py-32 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Background animated elements */}
      <motion.div
        className="absolute top-20 left-10 w-[30rem] h-[30rem] bg-gradient-to-br from-green-100/40 via-green-50/60 to-transparent rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          rotate: [0, 120, 240, 360]
        }}
        transition={{ 
          delay: 0.5,
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-green-100/50 via-green-50/70 to-transparent rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.6, 0.2],
          rotate: [360, 240, 120, 0]
        }}
        transition={{ 
          delay: 1,
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 left-20 w-32 h-32 border-2 border-green-200/40 rounded-3xl backdrop-blur-sm"
        variants={floatingVariants}
        animate="animate"
      />

      <motion.div
        className="absolute bottom-1/3 right-20 w-24 h-24 border-2 border-green-200/50 rounded-2xl backdrop-blur-sm"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.2, 1],
          y: [-15, 15, -15]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/4 right-16 w-28 h-28 bg-gradient-to-br from-green-100/90 to-green-50/60 rounded-full backdrop-blur-sm border border-green-200/30"
        animate={{
          y: [-25, 25, -25],
          x: [-10, 10, -10],
          rotate: [0, 360],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-16 w-20 h-20 bg-gradient-to-tl from-green-100/80 to-green-50/70 rounded-2xl backdrop-blur-sm border border-green-200/40"
        animate={{
          rotate: [45, -315],
          scale: [1, 1.3, 1],
          x: [-20, 20, -20]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          variants={headerVariants}
        >
          <motion.h2 
            className="text-3xl lg:text-4xl font-black text-gray-900 mb-8 leading-tight"
            variants={headerVariants}
          >
            WHAT OUR{' '}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-green-600 to-green-500"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              COMMUNITY
            </motion.span>{' '}
            SAYS
          </motion.h2>
          <motion.p 
            className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Join thousands of satisfied athletes across Egypt and experience
            the power of community-driven sports
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div 
          className="relative mb-20"
          variants={sectionVariants}
        >
          <div className="relative overflow-hidden">
            {/* Navigation Arrows */}
            {/* <motion.button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full shadow-xl border border-white/60 flex items-center justify-center text-2xl text-green-500 hover:text-green-600"
              onClick={prevTestimonial}
              whileHover={{ 
                scale: 1.1,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 25px rgba(34, 197, 94, 0.2)'
              }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              ←
            </motion.button> */}

            {/* <motion.button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full shadow-xl border border-white/60 flex items-center justify-center text-2xl text-green-500 hover:text-green-600"
              onClick={nextTestimonial}
              whileHover={{ 
                scale: 1.1,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 25px rgba(34, 197, 94, 0.2)'
              }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              →
            </motion.button> */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                className="group relative"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onHoverStart={() => setHoveredCard(0)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ 
                  y: -20,
                  scale: 1.02,
                  transition: { 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }
                }}
              >
                {/* Enhanced 3D glow effect */}
                <motion.div
                  className="absolute -inset-6 rounded-3xl opacity-0 blur-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${testimonials[currentTestimonial].glowColor}, transparent 70%)`
                  }}
                  animate={{
                    opacity: hoveredCard === 0 ? 1 : 0,
                    scale: hoveredCard === 0 ? 1.2 : 1
                  }}
                  transition={{ duration: 0.4 }}
                />
                
                <motion.div 
                  className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden min-h-[580px] max-w-4xl mx-auto"
                  style={{
                    backdropFilter: "blur(20px)",
                    background: "rgba(255, 255, 255, 0.85)"
                  }}
                  whileHover={{
                    boxShadow: `0 25px 50px -12px ${testimonials[currentTestimonial].glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.1)`,
                    background: "rgba(255, 255, 255, 0.95)",
                    y: -2
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <motion.img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].sport}
                      className="w-full h-full object-cover"
                      whileHover={{ 
                        scale: 1.15,
                        filter: "brightness(1.1) contrast(1.1)"
                      }}
                      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                    
                    {/* Enhanced gradient overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-transparent" 
                      whileHover={{
                        background: "linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0.3), transparent)"
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Top badges with enhanced styling */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                      <motion.span 
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg"
                        initial={{ scale: 0, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                        whileHover={{ 
                          scale: 1.1,
                          y: -2,
                          boxShadow: `0 8px 25px ${testimonials[currentTestimonial].glowColor}`
                        }}
                      >
                        {testimonials[currentTestimonial].sport}
                      </motion.span>
                      
                      <motion.div 
                        className="bg-white/30 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm font-bold border border-white/40 shadow-lg"
                        initial={{ scale: 0, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                        whileHover={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.4)',
                          scale: 1.05,
                          y: -2
                        }}
                      >
                        {testimonials[currentTestimonial].date}
                      </motion.div>
                    </div>

                    {/* Star rating badge */}
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg absolute bottom-6 right-6 flex items-center gap-2"
                      initial={{ y: 30, opacity: 0, scale: 0.8 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                      whileHover={{ 
                        scale: 1.1,
                        y: -3,
                        boxShadow: `0 8px 25px ${testimonials[currentTestimonial].glowColor}`
                      }}
                    >
                      <Star className="w-4 h-4 fill-current" />
                      {testimonials[currentTestimonial].rating}.0
                    </motion.div>

                    {/* Enhanced accent line */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-green-600"
                      initial={{ scaleX: 0 }}
                      animate={{ 
                        scaleX: hoveredCard === 0 ? 1 : 0,
                        height: hoveredCard === 0 ? 8 : 2
                      }}
                      style={{ transformOrigin: "left" }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>

                  {/* Enhanced content section */}
                  <div className="p-8 lg:p-10">
                    <motion.div
                      className="space-y-6"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <div className="flex items-center gap-6">
                        <motion.img
                          src={testimonials[currentTestimonial].avatar}
                          alt={testimonials[currentTestimonial].name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-green-500/20 shadow-lg"
                          whileHover={{ 
                            scale: 1.1,
                            borderColor: 'rgba(34, 197, 94, 0.4)',
                            boxShadow: `0 8px 25px ${testimonials[currentTestimonial].glowColor}`
                          }}
                        />
                        <div>
                          <motion.h3 
                            className="text-3xl lg:text-4xl font-black text-gray-900 mb-1"
                            whileHover={{
                              color: '#22c55e',
                              x: 5,
                              scale: 1.02
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            {testimonials[currentTestimonial].name}
                          </motion.h3>
                          <div className="flex items-center gap-2">
                            {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                  delay: 0.8 + i * 0.1, 
                                  type: "spring", 
                                  stiffness: 200 
                                }}
                                whileHover={{ scale: 1.2, rotate: 360 }}
                              >
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <blockquote className="text-gray-700 leading-relaxed text-lg lg:text-xl italic">
                        "{testimonials[currentTestimonial].review}"
                      </blockquote>

                      {/* Enhanced CTA button */}
                      <motion.div 
                        className="pt-6"
                        initial={{ opacity: 0.7 }}
                        animate={{ 
                          opacity: hoveredCard === 0 ? 1 : 0.7 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.button
                          className="group inline-flex items-center gap-4 text-lg font-bold text-green-500 hover:text-green-600 transition-all duration-300 cursor-pointer"
                          whileHover={{ 
                            x: 10,
                            scale: 1.05
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <span className="text-xl">Read Full Story</span>
                          <motion.div
                            className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xl cursor-pointer"
                            animate={{ 
                              x: hoveredCard === 0 ? 8 : 0,
                              rotate: hoveredCard === 0 ? 90 : 0,
                              scale: hoveredCard === 0 ? 1.2 : 1
                            }}
                            transition={{ duration: 0.3, type: "spring" }}
                            whileHover={{
                              backgroundColor: 'rgba(34, 197, 94, 0.15)',
                              borderColor: 'rgba(34, 197, 94, 0.5)',
                              boxShadow: `0 8px 25px ${testimonials[currentTestimonial].glowColor}`,
                              scale: 1.3
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
                    className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 pointer-events-none rounded-3xl"
                    transition={{ duration: 0.3 }}
                  />

                  {/* Enhanced circular hover effect */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-green-500/10 rounded-full opacity-0"
                    animate={{
                      scale: hoveredCard === 0 ? 8 : 0,
                      opacity: hoveredCard === 0 ? 1 : 0
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <motion.div 
            className="flex justify-center items-center space-x-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  currentTestimonial === index 
                    ? 'bg-green-500 border-green-500' 
                    : 'bg-white border-gray-300 hover:border-green-400'
                }`}
                onClick={() => handleDotClick(index)}
                whileHover={{ 
                  scale: 1.3,
                  backgroundColor: currentTestimonial === index ? '#22c55e' : '#f0fdf4'
                }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: currentTestimonial === index ? 1.2 : 1,
                  boxShadow: currentTestimonial === index 
                    ? `0 0 20px ${testimonials[currentTestimonial].glowColor}` 
                    : '0 2px 4px rgba(0,0,0,0.1)'
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Auto-play progress ring */}
                {currentTestimonial === index && autoPlay && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-green-300"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                    style={{
                      background: `conic-gradient(from 0deg, transparent 0%, #22c55e 0%, #22c55e var(--progress, 0%), transparent var(--progress, 0%))`
                    }}
                  />
                )}
              </motion.button>
            ))}
            
            {/* Auto-play indicator */}
            <motion.div 
              className="ml-6 flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.6 }}
            >
              {/* <motion.button
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  autoPlay 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-500 hover:border-green-400'
                }`}
                // onClick={() => setAutoPlay(!autoPlay)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* {autoPlay ? '⏸' : '▶'} */}
              {/* <span className="text-sm text-gray-500 font-medium">
                {/* {autoPlay ? 'Auto-play on' : 'Auto-play off'} */}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group text-center relative"
              whileHover={{ 
                y: -8, 
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              {/* Stat glow */}
              <motion.div
                className="absolute inset-0 bg-green-200/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              
              {/* <motion.div
                className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-xl"
                whileHover={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 20px 40px rgba(34, 197, 94, 0.15)'
                }}
              >
              //   <motion.h4 
              //     className="text-3xl lg:text-4xl font-black text-green-500 mb-2"
              //     initial={{ scale: 0, opacity: 0 }}
              //     animate={{ scale: 1, opacity: 1 }}
              //     transition={{ delay: 2.4 + index * 0.1, type: "spring", stiffness: 200 }}
              //     whileHover={{
              //       scale: 1.1,
              //       y: -2
              //     }}
              //   >
              //     {stat.number}
              //   </motion.h4>
              //   <motion.p 
              //     className="text-gray-600 text-base font-semibold"
              //     whileHover={{ color: '#374151' }}
              //   >
              //     {stat.label}
              //   </motion.p>
              // </motion.div> */}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Community;