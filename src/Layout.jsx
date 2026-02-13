import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Calendar, 
  Wallet, 
  Settings,
  Menu,
  X,
  Guitar
} from 'lucide-react';

const navItems = [
  { name: 'לוח בקרה', icon: LayoutDashboard, page: 'Dashboard' },
  { name: 'תלמידים', icon: GraduationCap, page: 'Students' },
  { name: 'יומן שיעורים', icon: Calendar, page: 'Lessons' },
  { name: 'כספים וחבילות', icon: Wallet, page: 'Finance' },
  { name: 'הגדרות', icon: Settings, page: 'Settings' },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-[#0F172A] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
        
        * {
          font-family: 'Varela Round', sans-serif;
        }
        
        :root {
          --neon-blue: #00F0FF;
          --neon-purple: #BD00FF;
          --dark-bg: #0F172A;
          --card-bg: #1E293B;
          --card-border: #334155;
        }
        
        .neon-glow {
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(189, 0, 255, 0.2);
        }
        
        .neon-border {
          border: 1px solid transparent;
          background: linear-gradient(#1E293B, #1E293B) padding-box,
                      linear-gradient(135deg, #00F0FF, #BD00FF) border-box;
        }
        
        .neon-text {
          background: linear-gradient(135deg, #00F0FF, #BD00FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .nav-item-active {
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(189, 0, 255, 0.1));
          border-right: 3px solid #00F0FF;
        }
        
        .btn-neon {
          background: linear-gradient(135deg, #00F0FF, #BD00FF);
          transition: all 0.3s ease;
        }
        
        .btn-neon:hover {
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.5), 0 0 60px rgba(189, 0, 255, 0.3);
          transform: translateY(-2px);
        }
        
        .card-cyber {
          background: #1E293B;
          border: 1px solid #334155;
          transition: all 0.3s ease;
        }
        
        .card-cyber:hover {
          border-color: #00F0FF;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
        }
        
        input, textarea, select {
          direction: rtl;
          text-align: right;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1E293B;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #00F0FF, #BD00FF);
          border-radius: 4px;
        }
        
        /* Modal backdrop */
        .modal-backdrop {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
        }
      `}</style>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-50 bg-[#0F172A] border-b border-[#334155] px-4 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#1E293B] transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <Guitar className="w-6 h-6 text-[#00F0FF]" />
            <span className="text-lg font-bold neon-text">Guitar Studio</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-[#0F172A] border-l border-[#334155] z-40
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-[#334155] hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
              <Guitar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold neon-text">Guitar Studio</h1>
              <p className="text-xs text-slate-400">ניהול סטודיו מתקדם</p>
            </div>
          </div>
        </div>

        <nav className="p-4 mt-16 lg:mt-0">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.page}>
                <Link
                  to={createPageUrl(item.page)}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    group relative overflow-hidden
                    ${currentPageName === item.page 
                      ? 'nav-item-active text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                      : 'text-slate-400 hover:text-white hover:bg-[#1E293B] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:translate-x-[-4px]'}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/0 via-[#00F0FF]/5 to-[#BD00FF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <item.icon size={20} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10 group-hover:tracking-wide transition-all duration-300">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>


      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:mr-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}