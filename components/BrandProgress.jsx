import {Card,Bar} from "./Ui";
import {inr} from "../utils/formatters";
export default function BrandProgress({t,period}){
  const p=Math.min(t.achievement,100),L=Math.PI*80,rem=Math.max(100-t.achievement,0);
  const color=p>=75?"#059669":p>=60?"#4f46e5":"#d97706";
  return <Card title="Brand Target Progress" subtitle={period}><div className="grid gap-6 md:grid-cols-[220px_1fr] items-center">
    <div className="relative mx-auto w-full max-w-[220px]"><svg viewBox="0 0 180 110" className="w-full"><path d="M10 100 A80 80 0 0 1 170 100" fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round"/>
      <path d="M10 100 A80 80 0 0 1 170 100" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${L*p/100} ${L}`} style={{transition:"stroke-dasharray .8s ease"}}/></svg>
      <div className="absolute inset-x-0 bottom-1 text-center"><div className="text-3xl font-semibold tabular-nums">{t.achievement.toFixed(1)}%</div><div className="text-xs text-slate-500">achieved</div></div></div>
    <div className="space-y-4"><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[["Brand target",inr(t.target)],["Achieved",inr(t.collected)],["Achievement",`${t.achievement.toFixed(1)}%`],["Remaining",`${rem.toFixed(1)}% · ${inr(t.pending)}`]].map(([a,b])=><div key={a}><div className="text-[11px] uppercase tracking-wider text-slate-500">{a}</div><div className="text-lg font-semibold tabular-nums">{b}</div></div>)}</div>
      <Bar v={p} color="bg-slate-800"/><p className="text-xs text-slate-500">{rem>0?`${inr(t.pending)} more collection is needed to complete the brand target.`:"Brand target completed."}</p></div></div></Card>;
}
