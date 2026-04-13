import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, Database, Send, Cloud, PieChart, ExternalLink, CheckCircle2 } from 'lucide-react';

const DashboardPage = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // RDS se aane wala data

  // Token uthana authorization ke liye
  const token = localStorage.getItem('access_token');

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
      // Upload ke baad history refresh karein
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
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Upload & Services Status */}
        <div className="lg:w-1/3 space-y-6">
          <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Cloud className="text-blue-600" /> Upload Center
            </h2>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center mb-6">
              <input type="file" id="pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              <label htmlFor="pdf" className="cursor-pointer group">
                <Upload className="mx-auto text-slate-300 group-hover:text-blue-500 transition-colors" size={40} />
                <p className="mt-4 text-slate-500 font-medium">{file ? file.name : "Select Resume PDF"}</p>
              </label>
            </div>
            <button 
              onClick={handleUpload}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 disabled:bg-slate-200 transition-all flex justify-center items-center gap-2"
              disabled={loading || !file}
            >
              {loading ? "Processing..." : "Run Analysis"}
            </button>
          </motion.div>

          {/* AWS Service Indicators (For Demo) */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Active Infrastructure</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-300"><Database size={16}/> RDS Storage</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-300"><Send size={16}/> SNS Gateway</span>
                <span className="text-green-400">Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results & History */}
        <div className="lg:w-2/3 space-y-8">
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-blue-600">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">{result.analysis.overall_score}% Match</h2>
                  <p className="text-slate-500 mt-1 font-medium italic">{result.analysis.feedback}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} /> Analysis Success
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(result.analysis.breakdown).map(([cat, data]) => (
                  <div key={cat} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">{cat}</p>
                    <p className="text-xl font-black text-slate-800">{data.score}%</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* History Section (The RDS Proof) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PieChart className="text-blue-600" /> Recent Scans (RDS)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-sm uppercase">
                    <th className="pb-4 font-bold">File</th>
                    <th className="pb-4 font-bold">Score</th>
                    <th className="pb-4 font-bold">Artifact</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {history.map((item, idx) => (
                    <tr key={idx} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-medium text-slate-800">{item.file_name}</td>
                      <td className="py-4 font-bold text-blue-600">{item.overall_score}%</td>
                      <td className="py-4">
                        <a href={item.s3_url} target="_blank" className="flex items-center gap-1 text-blue-500 hover:underline">
                          Link <ExternalLink size={14} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;