"use client";
export const Card = ({ title, subtitle, right, children, className = "" }) =>
  <section className={ `overflow-x-auto bg-white rounded-xl ring-1 ring-slate-200/70 shadow-sm p-5 min-w-0 animate-fadeUp ${className}`}>
    <div className="flex items-start justify-between gap-3 mb-4"><div><h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>{subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}</div>{right}</div>{children}</section>;
export const Bar = ({ v, color = "bg-indigo-500" }) => <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${Math.min(Math.max(v || 0, 0), 100)}%` }} /></div>;
const tone = { Excellent: "emerald", Good: "blue", "Needs Attention": "red", Average: "amber", Paid: "emerald", "Partially Paid": "teal", PTP: "blue", Overdue: "red", "Not Contacted": "slate", "Broken PTP": "orange" };
const cls = { emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200", blue: "bg-blue-50 text-blue-700 ring-blue-200", red: "bg-red-50 text-red-700 ring-red-200", amber: "bg-amber-50 text-amber-700 ring-amber-200", teal: "bg-teal-50 text-teal-700 ring-teal-200", slate: "bg-slate-100 text-slate-600 ring-slate-200", orange: "bg-orange-50 text-orange-700 ring-orange-200" };
export const Badge = ({ t }) => <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ring-1 whitespace-nowrap ${cls[tone[t] || "slate"]}`}>{t}</span>;
export const Pill = ({ children }) => <span className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-semibold text-white whitespace-nowrap">{children}</span>;
export const Empty = () => <div className="text-center text-slate-500 py-12 text-sm">No collection data found for the selected filters.</div>;
export const Btn = ({ children, ...p }) => <button {...p} className={`px-3 py-1.5 text-sm font-medium rounded-lg bg-white ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 active:scale-95 transition disabled:opacity-40 ${p.className || ""}`}>{children}</button>;
export const Kpi = ({ label, value, sub, p }) => <div className="bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-sm p-5 transition hover:shadow-md hover:-translate-y-0.5 animate-fadeUp">
  <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{label}</div><div className="text-2xl font-semibold mt-1.5 tracking-tight">{value}</div>
  <div className="text-xs text-slate-500 mt-0.5 mb-3">{sub}</div>{p != null ? <Bar v={p} /> : <div className="h-2" />}</div>;
export const Sel = ({ label, v, set, opts }) => <label className="block min-w-0 text-[11px] font-medium text-slate-500">{label}
  <select value={v} onChange={e => set(e.target.value)} className="mt-1 w-full rounded-lg bg-white ring-1 ring-slate-200 px-2.5 py-2 text-sm text-slate-900 hover:ring-slate-300 transition"><option value="">All</option>
    {opts.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}</select></label>;
export const Skeleton = () => <div className="space-y-4 animate-pulse"><div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">{[...Array(8)].map((_, i) => <div key={i} className="h-32 bg-slate-200/70 rounded-2xl" />)}</div><div className="h-64 bg-slate-200/70 rounded-2xl" /></div>;
export function Pager({ pg, pages, set, size, setSize }) {
  return <div className="flex flex-wrap items-center justify-between gap-2 pt-4 text-sm text-slate-600">
    {setSize ? <label className="flex items-center gap-2">Rows<select value={size} onChange={e => setSize(+e.target.value)} className="rounded-lg ring-1 ring-slate-200 px-1.5 py-1">{[5, 10, 25].map(n => <option key={n}>{n}</option>)}</select></label> : <span />}
    <div className="flex items-center gap-2"><Btn disabled={pg === 0} onClick={() => set(pg - 1)}>Prev</Btn><span className="tabular-nums">{pg + 1} / {pages}</span><Btn disabled={pg + 1 >= pages} onClick={() => set(pg + 1)}>Next</Btn></div></div>
}
export const TD = "px-3 py-3 whitespace-nowrap";
export const TH = "px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-slate-500 whitespace-nowrap";
import { AlertTriangle, Star } from "lucide-react";
export const TierTag = ({ tier, rank }) => tier === "top" ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700"><Star size={12} fill="currentColor" />Top performer{rank ? ` · #${rank}` : ""}</span>
  : tier === "low" ? <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600"><AlertTriangle size={12} />↓ Attention required</span> : null;
export const medal = r => r === 1 ? "🏆" : r === 2 ? "🥈" : r === 3 ? "🥉" : `#${r}`;
