
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Customers from './pages/Customers';
import Reports from './pages/Reports';

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

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
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
              <p className="text-xs font-bold text-slate-900 truncate">Andri Wijaya</p>
              <p className="text-[10px] text-slate-500 truncate">Senior Accountant</p>
            </div>
            <button className="text-slate-400 hover:text-rose-500 transition-colors">
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4 w-1/3">
            <div className="relative w-full">
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
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
