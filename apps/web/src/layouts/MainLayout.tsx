import { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  PieChart, 
  Target, 
  Settings, 
  Bell,
  User,
  Send,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Coins
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: SidebarItemProps) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative",
      active 
        ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200" 
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
      collapsed && "justify-center px-0"
    )}
    title={collapsed ? label : ""}
  >
    <Icon size={22} className={cn("shrink-0", active ? "text-white" : "text-slate-500 group-hover:text-blue-600")} />
    {!collapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden">{label}</span>}
    
    {collapsed && (
      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
        {label}
      </div>
    )}
  </div>
);

interface MainLayoutProps {
  children: ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function MainLayout({ children, onNavigate, currentPage }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex w-full font-sans antialiased text-slate-900 overflow-hidden">
      {/* Sidebar - Clean Light Theme */}
      <aside className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-50 flex flex-col shadow-sm",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 mb-4 relative">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-blue-200">
              <Coins size={22} />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-xl font-black tracking-tight text-slate-900 truncate">MonYess</span>
                <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Premium</span>
              </div>
            )}
          </div>
          
          {/* Toggle Button - Inside Sidebar Body */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-7 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all z-50"
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentPage === 'dashboard'} 
            onClick={() => onNavigate('dashboard')}
            collapsed={!sidebarOpen}
          />
          <SidebarItem 
            icon={Receipt} 
            label="Transaksi" 
            active={currentPage === 'transactions'} 
            onClick={() => onNavigate('transactions')}
            collapsed={!sidebarOpen}
          />
          <SidebarItem 
            icon={Wallet} 
            label="Akun" 
            active={currentPage === 'accounts'} 
            onClick={() => onNavigate('accounts')}
            collapsed={!sidebarOpen}
          />
          <SidebarItem icon={PieChart} label="Anggaran" active={false} onClick={() => {}} collapsed={!sidebarOpen} />
          <SidebarItem icon={Target} label="Target" active={false} onClick={() => {}} collapsed={!sidebarOpen} />
          <SidebarItem icon={Trophy} label="Pencapaian" active={false} onClick={() => {}} collapsed={!sidebarOpen} />
          <SidebarItem icon={Send} label="Telegram" active={false} onClick={() => {}} collapsed={!sidebarOpen} />
        </nav>

        {/* Level / User Status Section */}
        <div className="p-3 border-t border-slate-100">
          {sidebarOpen ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                  <Trophy size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pangkat</p>
                  <p className="text-sm text-slate-900 font-bold truncate">Level 1: Pemula</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-slate-400">Exp 40/100</span>
                  <span className="text-blue-600">40%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[40%] rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2 group relative">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm cursor-help">
                <Trophy size={20} />
              </div>
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                Lvl 1: Pemula (40%)
              </div>
            </div>
          )}
          
          <div className={cn("mt-3", !sidebarOpen && "flex justify-center")}>
            <SidebarItem icon={Settings} label="Pengaturan" active={false} onClick={() => {}} collapsed={!sidebarOpen} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-[#F8FAFC]">
        {/* Header - Refined Spacing */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-black text-blue-600 lg:hidden">MonYess</h2>
             <div className="hidden lg:block">
                <h1 className="text-sm font-bold text-slate-400">Dashboard</h1>
             </div>
          </div>

          <div className="flex items-center gap-2 md:gap-5">
            {/* Streak Indicator - More Compact */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-lg">
              <span className="text-base">🔥</span>
              <span className="text-[11px] font-black text-amber-900 uppercase tracking-tight">5 Hari</span>
            </div>

            {/* Notifications */}
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 relative transition-all active:scale-95 group">
              <Bell size={18} className="group-hover:text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
            </button>
            
            {/* Account Section - More Unified */}
            <div className="flex items-center gap-3 pl-3 md:pl-5 border-l border-slate-100">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-xs font-bold text-slate-900">User Monyess</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Free Account</p>
              </div>
              <div className="group relative">
                <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 cursor-pointer overflow-hidden">
                  <User size={18} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Container - Improved Padding */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
