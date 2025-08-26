import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Mail, Shield, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const ReadyToStart = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#0AB494] to-[#A3E4D7] py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-48 translate-y-48"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Sports Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of athletes across Egypt. Start discovering, joining, and hosting
            amazing sports events today.
          </p>
        </motion.div>

        <motion.div
          className="max-w-md mx-auto mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter your email..."
                className="pl-10 py-3 text-lg bg-white/95 border-0 focus:bg-white transition-colors"
              />
            </div>
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-[#0AB494] hover:bg-[#0AB494]/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                >
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col items-center text-white/90">
            <div className="bg-white/20 p-4 rounded-full mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Secure & Trusted</h3>
            <p className="text-sm text-center">Built on blockchain for transparent and secure transactions</p>
          </div>

          <div className="flex flex-col items-center text-white/90">
            <div className="bg-white/20 p-4 rounded-full mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Growing Community</h3>
            <p className="text-sm text-center">Connect with thousands of athletes nationwide</p>
          </div>

          <div className="flex flex-col items-center text-white/90">
            <div className="bg-white/20 p-4 rounded-full mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Events & Venues</h3>
            <p className="text-sm text-center">Find sports events and venues in your area</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 pt-8 border-t border-white/20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white/70 text-sm mb-4">Trusted by athletes across Egypt</p>
          <div className="flex justify-center items-center space-x-8 text-white/60">
            <span className="text-sm">🏃‍♂️ 15K+ Athletes</span>
            <span className="text-sm">⭐ 4.9/5 Rating</span>
            <span className="text-sm">🏆 500+ Events</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReadyToStart;
