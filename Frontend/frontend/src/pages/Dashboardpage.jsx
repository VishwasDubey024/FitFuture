import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Database, Send, Cloud, PieChart, 
  ExternalLink, CheckCircle2, LogOut, User,
  LayoutDashboard, History, BarChart3, Bell 
} from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('main'); 
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [userData, setUserData] = useState(null); 
  const navigate = useNavigate();

  const token = localStorage.getItem('access_token');

  const menuItems = [
    { id: 'main', name: 'Analysis Hub', icon: <LayoutDashboard size={20} /> },
    { id: 'vault', name: 'Resume Vault', icon: <History size={20} /> },
    { id: 'insights', name: 'Skill Insights', icon: <BarChart3 size={20} /> },
    { id: 'alerts', name: 'SNS Settings', icon: <Bell size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/user/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) handleLogout();
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
      fetchHistory();
    } catch (error) {
      console.error("Upload error", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/history/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) { console.log("History fetch error", err); }
  };

  useEffect(() => {
    if (!token) navigate('/login');
    else { fetchUserDetails(); fetchHistory(); }
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-100">
            <Cloud className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tighter">FutureFit</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-sm">
              {userData ? userData.username[0].toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-800 truncate">
                {userData ? userData.username : 'Loading...'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {userData ? userData.email : 'Please wait'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 text-red-500 bg-red-50 hover:bg-red-100 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <div className="mb-10">
          <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-1">
            Dashboard / {activeTab}
          </p>
          <h1 className="text-4xl font-black text-slate-900">
            {menuItems.find(m => m.id === activeTab)?.name}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          
          {activeTab === 'main' && (
            <motion.div key="main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2 space-y-6">
                  <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                      <Upload className="text-blue-600" size={20} /> New Scan
                    </h2>
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center mb-8 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <input type="file" id="pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                      <label htmlFor="pdf" className="cursor-pointer group">
                        <div className="bg-white w-16 h-16 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                           <Upload className="text-blue-600" size={28} />
                        </div>
                        <p className="text-slate-600 font-bold">{file ? file.name : "Drop Resume PDF Here"}</p>
                        <p className="text-slate-400 text-sm mt-1">Maximum file size: 5MB</p>
                      </label>
                    </div>
                    <button 
                      onClick={handleUpload}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
                      disabled={loading || !file}
                    >
                      {loading ? "System Processing..." : "Start Cloud Analysis"}
                    </button>
                  </div>

                  <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl">
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6">System Architecture</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm italic">
                        <span className="flex items-center gap-2 text-slate-300"><Database size={16}/> RDS (User Data)</span>
                        <span className="text-green-400">Live</span>
                      </div>
                      <div className="flex items-center justify-between text-sm italic">
                        <span className="flex items-center gap-2 text-slate-300"><Send size={16}/> SQS (Background)</span>
                        <span className="text-green-400">Ready</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  {result ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 rounded-[32px] shadow-xl border-l-8 border-blue-600 h-full">
                      <h2 className="text-5xl font-black text-slate-900 mb-2">{result.analysis.overall_score}%</h2>
                      <p className="text-slate-500 mb-8 font-medium italic">"{result.analysis.feedback}"</p>
                      <div className="space-y-4">
                        {Object.entries(result.analysis.breakdown).map(([cat, data]) => (
                          <div key={cat} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat}</span>
                            <span className="text-xl font-black text-slate-800">{data.score}%</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[32px] h-full flex items-center justify-center text-slate-400 font-medium italic p-20 text-center">
                      Analysis results will appear here after upload
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'vault' && (
            <motion.div key="vault" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-slate-400 text-xs uppercase tracking-widest">
                      <th className="px-10 py-6 font-black">Document</th>
                      <th className="px-10 py-6 font-black text-center">ATS Score</th>
                      <th className="px-10 py-6 font-black text-right">AWS Artifact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-600">
                    {history.length > 0 ? history.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6 font-bold text-slate-800">{item.file_name}</td>
                        <td className="px-10 py-6 text-center">
                           <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full font-black text-sm">
                             {item.overall_score}%
                           </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <a href={item.s3_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 font-bold flex items-center justify-end gap-1">
                            S3 Link <ExternalLink size={14} />
                          </a>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="py-20 text-center text-slate-400 italic font-medium">No history found in RDS yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {(activeTab === 'insights' || activeTab === 'alerts') && (
            <div className="bg-white p-24 rounded-[32px] border border-slate-100 text-center shadow-sm">
              <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="text-blue-600" size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Under Development</h2>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                We are currently connecting the SQS background workers and SNS notification services for this module.
              </p>
            </div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardPage;