import React, { useState } from 'react';
import { ChevronDown, FileAudio, FileVideo, Shield, Clock, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What file formats do you support?",
      answer: "We currently support audio files (.mp3, .wav, .flac) and video files (.mp4, .mov, .avi) up to 500MB in size. Our system automatically detects the file type and processes it accordingly.",
      icon: <FileAudio className="text-blue-600" size={20} />,
      related: <FileVideo className="text-blue-600 ml-2" size={20} />
    },
    {
      question: "How do you ensure my data privacy?",
      answer: "All files are encrypted during transfer and processing. We automatically delete your files 24 hours after analysis completes, and we never store or share your content with third parties.",
      icon: <Shield className="text-blue-600" size={20} />
    },
    {
      question: "What's the typical processing time?",
      answer: "Processing time varies by file size. Most files under 10 minutes process in under 30 seconds. For longer files (up to 1 hour), expect 2-3 minutes of processing time.",
      icon: <Clock className="text-blue-600" size={20} />
    },
    {
      question: "What does the analysis report include?",
      answer: "Your comprehensive report includes timestamped detections, confidence scores for each finding, and visual waveform analysis for audio files. Reports can be exported as PDF or CSV.",
      icon: <FileText className="text-blue-600" size={20} />
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our service
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center">
                  {faq.icon && <span className="mr-4">{faq.icon}</span>}
                  {faq.related && <span>{faq.related}</span>}
                  <h3 className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="text-gray-500 h-5 w-5 cursor-pointer" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{ 
                      opacity: 0,
                      height: 0,
                    }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeInOut"
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;