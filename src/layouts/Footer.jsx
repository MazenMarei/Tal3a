import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Youtube, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const footerVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
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

  const socialVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 10
      }
    }
  };

  return (
    <div>
      <motion.footer 
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white py-16"
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div variants={sectionVariants}>
            <motion.h3 
                className="font-bold mb-6 text-lg text-green-300"
                whileHover={{ scale: 1.05, color: "#4ade80" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Gift Cards
              </motion.h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  { text: "Promotions", href: "/Promotions" },
                  { text: "Find A Store", href: "/FindAStore" },
                  { text: "Become A Member", href: "/BecomeAMember" },
                  { text: "Tal3a Magazine", href: "/KentJournal" },
                  { text: "Send Us Feedback", href: "/Feedback" }
                ].map((item, index) => (
                  <motion.li
                    key={item.text}
                    variants={itemVariants}
                    whileHover={{ 
                      x: 8, 
                      color: "#ffffff",
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                  >
                    <motion.a 
                      href={item.href} 
                      className="hover:text-green-300 transition-all duration-300 hover:underline decoration-green-300 underline-offset-4 block py-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      {item.text}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={sectionVariants}>
              <motion.h3 
                className="font-bold mb-6 text-lg text-green-300"
                whileHover={{ scale: 1.05, color: "#4ade80" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Get Help
              </motion.h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  { text: "Order Status", href: "/OrderStatus" },
                  { text: "Shipping & Delivery", href: "/ShippingAndDelivery" },
                  { text: "Returns", href: "/Returns" },
                  { text: "Order Cancellation", href: "/OrderCancellation" },
                  { text: "Payment Options", href: "/PaymentOptions" },
                  { text: "Gift Card Balance", href: "/GiftCardBalance" },
                  { text: "Contact Us", href: "/ContactUs" }
                ].map((item, index) => (
                  <motion.li
                    key={item.text}
                    variants={itemVariants}
                    whileHover={{ 
                      x: 8, 
                      color: "#ffffff",
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                  >
                    <motion.a 
                      href={item.href} 
                      className="hover:text-green-300 transition-all duration-300 hover:underline decoration-green-300 underline-offset-4 block py-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      {item.text}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={sectionVariants}>
              <motion.h3 
                className="font-bold mb-6 text-lg text-green-300"
                whileHover={{ scale: 1.05, color: "#4ade80" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                About Tal3a
              </motion.h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  { text: "News", href: "/News" },
                  { text: "Careers", href: "/Careers" },
                  { text: "Investors", href: "/Investors" },
                  { text: "Purpose", href: "/Purpose" },
                  { text: "Sustainability", href: "/Sustainability" }
                ].map((item, index) => (
                  <motion.li
                    key={item.text}
                    variants={itemVariants}
                    whileHover={{ 
                      x: 8, 
                      color: "#ffffff",
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                  >
                    <motion.a 
                      href={item.href} 
                      className="hover:text-green-300 transition-all duration-300 hover:underline decoration-green-300 underline-offset-4 block py-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      {item.text}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={sectionVariants}>
              <motion.h3 
                className="font-bold mb-6 text-lg text-green-300"
                whileHover={{ scale: 1.05, color: "#4ade80" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Follow Us
              </motion.h3>
              <div className="flex space-x-6 mb-6">
                {[
                  { Icon: Twitter, href: "https://twitter.com/tal3a_egypt", label: "Twitter" },
                  { Icon: Instagram, href: "https://www.instagram.com/tal3a_egypt", label: "Instagram" },
                  { Icon: Youtube, href: "https://www.youtube.com/@tal3a_egypt", label: "YouTube" }
                ].map(({ Icon, href, label }, index) => (
                  <motion.a
                    key={label}
                    href={href}
                    className="bg-gray-800 p-3 mx-2 rounded-full hover:bg-green-600 transition-all duration-300 group"
                    variants={socialVariants}
                    whileHover={{ 
                      scale: 1.15,
                      rotate: 5,
                      boxShadow: "0 8px 25px rgba(34, 197, 94, 0.4)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
              <motion.div 
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-green-600 transition-all duration-300"
                whileHover={{ scale: 1.02, backgroundColor: "#1f2937" }}
                variants={itemVariants}
              >
                <p className="text-sm text-gray-300 mb-2">Join Our Community</p>
                <motion.button
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 w-full cursor-pointer"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe Now
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            variants={sectionVariants}
          >
            <motion.div 
              className="flex items-center space-x-3"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <MapPin className="h-4 w-5 text-white-400" />
              </motion.div>
              <span className="text-gray-300 font-medium">Egypt</span>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-2 text-gray-300 text-sm"
              variants={itemVariants}
            >
              <span>© All Rights Reserved</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ["#ef4444", "#f97316", "#ef4444"]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex space-x-6 text-sm text-gray-300"
              variants={sectionVariants}
            >
              {[
                { text: "Guides", href: "/Guides" },
                { text: "Terms of Use", href: "/TermsOfUse" },
                { text: "Privacy Policy", href: "/PrivacyPolicy" }
              ].map((item, index) => (
                <motion.a
                  key={item.text}
                  href={item.href}
                  className="hover:text-green-300 transition-all duration-300 hover:underline decoration-green-300 underline-offset-4 mx-2"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -2,
                    scale: 1.05
                  }}
                >
                  {item.text}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Footer;