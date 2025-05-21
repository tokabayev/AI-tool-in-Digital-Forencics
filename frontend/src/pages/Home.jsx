import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {
  return (
    <div className="min-h-[150vh] bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center px-4 py-20">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-6xl w-full mx-auto"
      >
    
        <div className="text-center mb-24">
          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              AI Media Analysis
            </span>
            <br />
            <span className="text-gray-800">Done Right</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto"
          >
            Our advanced AI detects sensitive content in audio and video with 
            industry-leading accuracy while preserving your privacy.
          </motion.p>
          
          <motion.div 
            variants={fadeIn}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Link
              to="/upload"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Analyzing Now
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl text-lg font-medium hover:bg-blue-50 transition-all duration-300"
            >
              See How It Works
            </Link>
          </motion.div>
        </div>

  
        <motion.div 
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 mb-24"
        >
          {[
            {
              icon: '🤖',
              title: 'Advanced AI',
              desc: 'Deep neural networks trained on millions of samples for precise detection of sensitive content.',
              color: 'from-purple-500 to-indigo-500'
            },
            {
              icon: '🔒',
              title: 'Your Data Stays Yours',
              desc: 'We process your files without storing them. Full encryption and automatic deletion after analysis.',
              color: 'from-green-500 to-teal-500'
            },
            {
              icon: '⚡',
              title: 'Instant Results',
              desc: 'Get detailed reports in seconds, even for large files, thanks to our optimized infrastructure.',
              color: 'from-orange-500 to-pink-500'
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              variants={fadeIn}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full"
            >
              <div className={`text-4xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

   
        <motion.div 
          variants={fadeIn}
          className="bg-white rounded-2xl shadow-xl p-12 text-center mb-24"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Professionals Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">99.7%</div>
              <p className="text-gray-600">Accuracy rate</p>
            </div>
            <div>
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500 mb-3">2.4s</div>
              <p className="text-gray-600">Average processing time</p>
            </div>
            <div>
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-3">10K+</div>
              <p className="text-gray-600">Files analyzed daily</p>
            </div>
          </div>
        </motion.div>

      
        <motion.div 
          variants={fadeIn}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Analyze Your Media?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust our platform for their content analysis needs.
          </p>
          <Link
            to="/upload"
            className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            Get Started - It's Free
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;