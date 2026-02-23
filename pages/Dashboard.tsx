
import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { revenueData } from '../services/mockData';
import { getFinancialInsight } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [insight, setInsight] = useState<string>('Menganalisis data keuangan...');
  const [isInsightLoading, setIsInsightLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setIsInsightLoading(true);
      const prompt = `Based on these monthly revenue values: ${revenueData.map(d => `Rp${d.collection}`).join(', ')}. Provide a 2-sentence summary of the financial health of this Indonesian water utility.`;
      const result = await getFinancialInsight(prompt);
      setInsight(result);
      setIsInsightLoading(false);
    };
    fetchInsight();
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ringkasan Finansial</h2>
          <p className="text-slate-500 mt-1">Laporan kinerja akuntansi real-time periode Oktober 2023</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span>30 Hari Terakhir</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Billing Batch Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pendapatan Bulan Ini', value: 'Rp 125,43M', change: '+12.5%', trend: 'up', icon: 'payments', color: 'blue', sub: 'Bulan lalu Rp 111,20M' },
          { label: 'Konsumsi Air Total', value: '45.280 m³', change: '+3.2%', trend: 'up', icon: 'water_damage', color: 'indigo', sub: 'Aktif di semua zona' },
          { label: 'Pelanggan Aktif', value: '12.840', change: '+0.8%', trend: 'up', icon: 'group', color: 'sky', sub: '98 registrasi baru' },
          { label: 'Tunggakan Tagihan', value: '142 Kasus', change: '-5.4%', trend: 'down', icon: 'warning', color: 'red', sub: 'Total Arrear: Rp 18,2M' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-lg`}>
                <span className="material-symbols-outlined">{kpi.icon}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${kpi.trend === 'up' ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
                <span className="material-symbols-outlined text-[14px]">trending_{kpi.trend}</span> {kpi.change}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* AI Insight Box */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-4 items-center">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shrink-0 animate-pulse">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <div>
          <h4 className="text-sm font-bold text-primary mb-1">AI Financial Insights</h4>
          <p className="text-sm text-slate-700 leading-relaxed italic">
            {isInsightLoading ? 'Sedang merumuskan analisis...' : `"${insight}"`}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              Tren Pendapatan Bulanan
              <span className="material-symbols-outlined text-slate-300 text-[18px]">info</span>
            </h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Terkumpul
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span> Proyeksi
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1142d4" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1142d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="collection" stroke="#1142d4" strokeWidth={3} fillOpacity={1} fill="url(#colorColl)" />
                <Area type="monotone" dataKey="projection" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water Consumption Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-900">Konsumsi Air Bulanan (m³)</h4>
            <select className="bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-500 py-1.5 pl-3 pr-8 focus:ring-0 cursor-pointer">
              <option>Per Meter Zone</option>
              <option>Per Tipe Pelanggan</option>
            </select>
          </div>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="collection" fill="#1142d4" radius={[6, 6, 0, 0]} barSize={40}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === revenueData.length - 1 ? '#1142d4' : '#c7d2fe'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
