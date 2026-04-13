import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Zap, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="pt-24 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wide uppercase mb-6 inline-block">
            Powered by AWS & AI
          </span>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">
            Analyze your resume for <br />
            <span className="text-blue-600">Cloud Readiness.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your PDF and get a deep technical breakdown of your skills 
            mapped across AWS, DevOps, and Full-Stack development using serverless intelligence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">
              Start Scanning Free
            </Link>
            <button className="px-10 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              How it works
            </button>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Cpu />, title: "Serverless Processing", desc: "Powered by AWS Lambda for scalable resume extraction." },
              { icon: <ShieldCheck />, title: "Secure Storage", desc: "Your artifacts are securely stored in AWS S3 buckets." },
              { icon: <Zap />, title: "Instant Alerts", desc: "Real-time notifications via Amazon SNS on analysis completion." },
              { icon: <BarChart3 />, title: "Skill Matrix", desc: "Complex categorization of skills across 3 major tech domains." }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;