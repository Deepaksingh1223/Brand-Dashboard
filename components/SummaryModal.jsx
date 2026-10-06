import {useEffect} from "react";
import {AlertTriangle,Sparkles,Star,X} from "lucide-react";
import {fmtDate,inr} from "../utils/formatters";
import {Bar} from "./Ui";
const Row=({a,b,c})=><li className="flex items-center justify-between gap-3 py-1.5 text-sm border-t border-black/5 first:border-0"><span className="font-medium truncate">{a}</span><span className="text-slate-600 tabular-nums whitespace-nowrap">{b}{c&&<span className="ml-2 font-semibold text-slate-900">{c}</span>}</span></li>;
export default function SummaryModal({d,onClose,onImport}){
  useEffect(()=>{const h=e=>e.key==="Escape"&&onClose();window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[onClose]);
  const t=d.total,empty=!t||!t.target,rem=Math.max(100-(t?.achievement||0),0);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 backdrop-blur-[2px] p-4 animate-fade" onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl p-5 sm:p-6 animate-fadeUp">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wider text-slate-500">Current period</p><h2 className="text-lg font-semibold">{d.periodLabel} Performance Summary</h2></div>
        <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18}/></button></div>
      {empty?<p className="py-10 text-center text-sm text-slate-500">No collection data found for the selected filters.</p>:<>
      <section className="mt-4 rounded-xl bg-sky-50 ring-1 ring-sky-100 p-4"><h3 className="text-sm font-semibold text-sky-800 mb-3">🎯 Brand performance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[["Brand target",inr(t.target)],["Total achievement",inr(t.collected)],["Achievement",`${t.achievement.toFixed(1)}%`],["Remaining",`${inr(t.pending)} (${rem.toFixed(1)}%)`]].map(([a,b])=><div key={a}><div className="text-[11px] uppercase tracking-wider text-slate-500">{a}</div><div className="font-semibold tabular-nums">{b}</div></div>)}</div>
        <div className="mt-3"><Bar v={t.achievement} color="bg-sky-600"/></div></section>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-4"><h3 className="flex items-center gap-1.5 text-sm font-semibold text-emerald-800 mb-2"><Star size={15} fill="currentColor"/>Top performers</h3><ul>
          {d.bestTL&&<Row a={`Best team: ${d.bestTL.team}`} b={`TL ${d.bestTL.name}`} c={`${d.bestTL.achievement.toFixed(1)}%`}/>}
          {d.top[0]&&<Row a={`Best member: ${d.top[0].name}`} b={d.top[0].tlName} c={`${d.top[0].achievement.toFixed(1)}%`}/>}
          {d.topCollector&&<Row a={`Highest collection: ${d.topCollector.name}`} b="" c={inr(d.topCollector.collected)}/>}
          {d.bestDay&&<Row a={`Best day: ${fmtDate(d.bestDay.date)}`} b="" c={inr(d.bestDay.collected)}/>}
          {d.top.map((e,i)=><Row key={e.id} a={`${["🏆","🥈","🥉"][i]} ${e.name}`} b={inr(e.collected)} c={`${e.achievement.toFixed(1)}%`}/>)}</ul></section>
        <section className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-4"><h3 className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 mb-2"><AlertTriangle size={15}/>Attention required</h3><ul>
          {d.worstTL&&<Row a={`Lowest team: ${d.worstTL.team}`} b={`TL ${d.worstTL.name}`} c={`${d.worstTL.achievement.toFixed(1)}%`}/>}
          {d.lowTLs.filter(x=>x!==d.worstTL).map(x=><Row key={x.id} a={`Low TL: ${x.name}`} b={x.team} c={`${x.achievement.toFixed(1)}%`}/>)}
          {d.behind.map(x=><Row key={x.id} a={`${x.team} behind target`} b="Remaining" c={inr(x.pending)}/>)}
          {d.lowMembers.slice(0,3).map(e=><Row key={e.id} a={`↓ ${e.name}`} b={e.tlName} c={`${e.achievement.toFixed(1)}%`}/>)}
          {d.lowDay&&<Row a={`Lowest day: ${fmtDate(d.lowDay.date)}`} b="" c={inr(d.lowDay.collected)}/>}</ul></section></div></>}
      <section className="mt-4 rounded-xl bg-violet-50 ring-2 ring-violet-300 p-4"><h3 className="flex items-center gap-1.5 text-sm font-semibold text-violet-800"><Sparkles size={15}/>Imported / new data</h3>
        {d.impRecs>0?<p className="text-sm mt-1.5 text-violet-900">{d.impRecs} imported rows for {d.impExecs} members in this period ({d.impDates.length===1?fmtDate(d.impDates[0]):`${fmtDate(d.impDates[0])} – ${fmtDate(d.impDates[d.impDates.length-1])}`}). Marked <b>New data</b> across the dashboard.</p>
        :<p className="text-sm mt-1.5 text-violet-900">{d.impTotal>0?`No imported rows in this period (${d.impTotal} exist in other dates).`:"No imported data yet. Import a CSV to see new data highlighted here."}</p>}
        <button onClick={onImport} className="mt-3 text-sm font-medium text-violet-700 underline underline-offset-2">Import data</button></section>
      <button onClick={onClose} className="mt-5 w-full rounded-lg bg-slate-900 text-white font-medium py-2.5 hover:bg-slate-800 transition">Continue to dashboard</button></div></div>;
}
