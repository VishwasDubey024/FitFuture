import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Rocket className="text-blue-600" size={28} />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FutureFit
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</Link>
            {token ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold hover:bg-slate-800 transition-all">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;