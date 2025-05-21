import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, FileSearch, Database, Users, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

function About() {
  return (
    <div className="min-h-screen bg-white pt-24 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 items-center mb-24"
        >
          <motion.div variants={fadeIn}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Our <span className="text-blue-600">Technical Foundation</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Built by a team of machine learning engineers and security experts, our platform combines cutting-edge algorithms with robust infrastructure.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              We've developed proprietary techniques for content analysis that outperform generic solutions while maintaining strict privacy standards.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition-all duration-300"
            >
              Documentation
              <Code size={20} className="ml-2" />
            </Link>
          </motion.div>

          <motion.div 
            variants={fadeIn}
            className="space-y-6"
          >
            <Feature
              Icon={Database}
              title="Custom Dataset"
              description="Over 2TB of annotated media samples powering our detection models."
            />
            <Feature
              Icon={Users}
              title="Expert Team"
              description="15+ years combined experience in ML and content moderation."
            />
            <Feature
              Icon={Cpu}
              title="Optimized Models"
              description="Specialized architectures for real-time audio/video processing."
            />
          </motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gray-50 rounded-2xl p-12 mb-24 border border-gray-200"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Development Roadmap</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <RoadmapItem 
              title="Q3 2023" 
              items={[
                "Core detection engine",
                "Basic audio analysis",
                "API v1.0 release"
              ]} 
            />
            <RoadmapItem 
              title="Q4 2023" 
              items={[
                "Video processing",
                "Dashboard analytics",
                "Enterprise features"
              ]} 
            />
            <RoadmapItem 
              title="2024" 
              items={[
                "Multi-language support",
                "Custom model training",
                "On-premise deployment"
              ]} 
            />
          </div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Want to learn more about our technology?</h3>
          <Link
            to="/contact"
            className="inline-flex items-center px-10 py-5 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition-all duration-300"
          >
            Contact Our Team
            <Users size={20} className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ Icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="flex items-start bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
    >
      <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mr-4">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-lg mb-1">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}

function RoadmapItem({ title, items }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h4 className="font-bold text-lg text-blue-600 mb-4">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default About;