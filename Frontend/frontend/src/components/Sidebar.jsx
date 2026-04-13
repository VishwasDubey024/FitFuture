import { LayoutDashboard, History, BarChart3, Bell, Settings } from 'lucide-react';

const menuItems = [
  { name: 'Analysis Hub', icon: <LayoutDashboard size={20} />, id: 'main' },
  { name: 'Resume Vault', icon: <History size={20} />, id: 'history' },
  { name: 'Skill Insights', icon: <BarChart3 size={20} />, id: 'analytics' },
  { name: 'Alert Settings', icon: <Bell size={20} />, id: 'alerts' },
];