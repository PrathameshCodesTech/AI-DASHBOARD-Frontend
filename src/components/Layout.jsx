import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Menu, 
  X, 
  Sparkles,
  LogOut,
  Settings
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Prompt dashboard', icon: MessageSquare, path: '/chat' },
  ];

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-dark-900/50 backdrop-blur-sm border-r border-dark-800 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">
                Prompt AI
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-dark-400" />
            ) : (
              <Menu className="w-5 h-5 text-dark-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary-600/20 to-primary-500/10 border border-primary-500/30 text-primary-400' 
                    : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/50'
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
                {isActive && sidebarOpen && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary-500"></span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-dark-800 p-4">
          {sidebarOpen ? (
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-dark-400 hover:text-dark-100 hover:bg-dark-800/50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-sm">Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col items-center">
              <button className="p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-800/50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-dark-900/50 backdrop-blur-sm border-b border-dark-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-dark-100">
              {navigation.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-dark-800/50 rounded-lg border border-dark-700">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm text-dark-300">Prompt Online</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;