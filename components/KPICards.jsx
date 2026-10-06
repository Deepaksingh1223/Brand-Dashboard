import {Crown,Gauge,Hourglass,IndianRupee,Sparkles,Star,Target,TrendingUp,Users} from "lucide-react";
import {AlertTriangle} from "lucide-react";
import {Bar} from "./Ui";
import {inr,pct} from "../utils/formatters";
import {status,tierOf} from "../utils/calculations";

const C={sky:["bg-sky-50 ring-sky-100","bg-sky-100 ring-sky-300","bg-sky-100 text-sky-700"],emerald:["bg-emerald-50 ring-emerald-100","bg-emerald-100 ring-emerald-300","bg-emerald-100 text-emerald-700"],
  violet:["bg-violet-50 ring-violet-100","bg-violet-100 ring-violet-300","bg-violet-100 text-violet-700"],amber:["bg-amber-50 ring-amber-100","bg-amber-100 ring-amber-300","bg-amber-100 text-amber-700"],
  indigo:["bg-indigo-50 ring-indigo-100","bg-indigo-100 ring-indigo-300","bg-indigo-100 text-indigo-700"],teal:["bg-teal-50 ring-teal-100","bg-teal-100 ring-teal-300","bg-teal-100 text-teal-700"],
  rose:["bg-rose-50 ring-rose-100","bg-rose-100 ring-rose-300","bg-rose-100 text-rose-700"],cyan:["bg-cyan-50 ring-cyan-100","bg-cyan-100 ring-cyan-300","bg-cyan-100 text-cyan-700"]};
const clamp=n=>Math.min(Math.max(n,0),100);

export default function KPICards({t,tlRows,members,imported}){
  const active=members.filter(e=>e.collected>0).length,bestTL=tlRows[0],topM=members[0];
  const cards=[
    {l:"Brand Target",v:inr(t.target),s:`${members.length} members · ${tlRows.length} TLs`,I:Target,c:"sky",h:null},
    {l:"Total Collection",v:inr(t.collected),s:`${pct(t.collected,t.target)} of target`,I:IndianRupee,c:"emerald",h:t.achievement,p:t.achievement,flow:1},
    {l:"Target Achieved",v:`${t.achievement.toFixed(1)}%`,s:status(t.achievement),I:Gauge,c:"violet",h:t.achievement,p:t.achievement},
    {l:"Remaining Target",v:inr(t.pending),s:`${clamp(100-t.achievement).toFixed(1)}% left`,I:Hourglass,c:"amber",h:clamp(100-t.achievement)},
    {l:"Active Team",v:`${active} / ${members.length}`,s:"Members with collection",I:Users,c:"indigo",h:members.length?active/members.length*100:0,p:members.length?active/members.length*100:0},
    {l:"Overall Performance",v:status(t.achievement),s:`${t.achievement.toFixed(1)}% achievement`,I:TrendingUp,c:"teal",h:t.achievement,flow:1},
    {l:"Best TL",v:bestTL?bestTL.name:"-",s:bestTL?`${bestTL.team} · ${bestTL.achievement.toFixed(1)}%`:"",I:Crown,c:"rose",h:bestTL?bestTL.achievement:null,best:!!bestTL&&tlRows.length>1},
    {l:"Top Performer",v:topM?topM.name:"-",s:topM?`${topM.tlName}'s team · ${topM.achievement.toFixed(1)}%`:"",I:Star,c:"cyan",h:topM?topM.achievement:null,best:!!topM&&members.length>1}];
  return <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">{cards.map(k=>{
    const ti=k.best?"top":k.h==null?"info":tierOf(k.h),[n,top,ic]=C[k.c],low=ti==="low";
    const cls=ti==="top"?`${top} ring-2 shadow-md`:low?"bg-slate-50 ring-1 ring-slate-200 text-slate-500":`${n} ring-1`;
    return <div key={k.l} className={`rounded-xl p-4 transition hover:shadow-md ${cls}`}>
      <div className="flex items-start justify-between"><span className={`h-9 w-9 grid place-items-center rounded-lg ${low?"bg-slate-100 text-slate-400":ic}`}><k.I size={18}/></span>
        <div className="flex flex-col items-end gap-1">
          {ti==="top"&&<span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700"><Star size={12} fill="currentColor"/>{k.best?"#1 Best":"Top performer"} ↑</span>}
          {low&&<span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600"><AlertTriangle size={12}/>↓ Attention</span>}
          {k.flow&&imported>0&&<span className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full bg-violet-600 text-white px-2 py-0.5"><Sparkles size={10}/>New data</span>}</div></div>
      <div className="mt-3 text-[11px] font-medium uppercase tracking-wider opacity-70">{k.l}</div>
      <div className={`text-2xl font-semibold tracking-tight truncate ${low?"text-slate-600":"text-slate-900"}`}>{k.v}</div>
      <div className="text-xs opacity-70 mb-3 truncate">{k.s}</div>{k.p!=null?<Bar v={k.p} color={low?"bg-slate-300":"bg-slate-700"}/>:<div className="h-2"/>}</div>})}</div>;
}
