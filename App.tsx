
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './services/firebase';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';

const SidebarLink: React.FC<{ to: string, icon: string, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/' && location.pathname === '');

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${isActive
        ? 'bg-primary/10 text-primary border-r-2 border-primary'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
    >
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode, user: User | null }> = ({ children, user }) => {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`absolute md:relative z-30 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${isSidebarCollapsed ? 'md:w-0 md:border-none' : 'w-64'}`}>
        
        {/* Sidebar Content Wrapper */}
        <div className="w-64 h-full flex flex-col overflow-hidden">

          <div className="p-6 flex items-center gap-3">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">water_drop</span>
          </div>
          <div>
            <h1 className="text-slate-900 text-sm font-bold leading-tight">PDAM Accounting</h1>
            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Tirta Digital</p>
          </div>
        </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
          <SidebarLink to="/" icon="dashboard" label="Dashboard" />
          <SidebarLink to="/billing" icon="receipt_long" label="Tagihan" />
          <SidebarLink to="/customers" icon="group" label="Pelanggan" />
          <SidebarLink to="/reports" icon="bar_chart" label="Laporan & Analitik" />

            <div className="pt-6 pb-2">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrasi</p>
          </div>
          <SidebarLink to="/settings" icon="settings" label="Pengaturan" />
          <SidebarLink to="/help" icon="help" label="Pusat Bantuan" />
        </nav>

          <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <span className="material-symbols-outlined text-xl">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.displayName || (user?.email?.split('@')[0]) || 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || 'Unauthorized'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
              title="Keluar"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden text-slate-500 hover:text-primary"
              title="Buka Menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            {/* Desktop Toggle Menu */}
            <button
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:block text-slate-500 hover:text-primary"
              title={isSidebarCollapsed ? "Buka Menu" : "Tutup Menu"}
            >
              <span className="material-symbols-outlined">{isSidebarCollapsed ? 'menu' : 'menu_open'}</span>
            </button>
            <div className="relative w-full hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary transition-all placeholder:text-slate-400"
                placeholder="Cari ID Pelanggan, No. Tagihan..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">Unit Pelayanan Jakarta</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">ID Kantor: JK-001</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined">corporate_fare</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout user={user}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<Dashboard />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
