import {AlertTriangle} from "lucide-react";
import {Card} from "./Ui";
import {inr} from "../utils/formatters";
export default function AttentionPanel({d,onSelect}){
  const tls=d.lowTLs.length?d.lowTLs:d.behind.filter(t=>t.pending>0).slice(0,1);
  return <Card title="Attention Required" subtitle="Areas where the target is behind"><div className="grid gap-4 md:grid-cols-2">
    <div><h3 className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 mb-2"><AlertTriangle size={14}/>Teams / TLs to improve</h3>
      {!tls.length?<p className="text-sm text-slate-500">All teams are on track.</p>:<ul className="space-y-2">{tls.map(t=><li key={t.id}><button onClick={()=>onSelect({tl:t.id,ex:""})} className="w-full text-left rounded-lg bg-slate-50 ring-1 ring-slate-200 px-3 py-2 text-sm hover:ring-amber-300 transition"><b>{t.team}</b> · {t.name}<span className="block text-xs text-slate-500">↓ {t.achievement.toFixed(1)}% achieved · {inr(t.pending)} remaining</span></button></li>)}</ul>}</div>
    <div><h3 className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 mb-2"><AlertTriangle size={14}/>Members with low achievement</h3>
      {!d.lowMembers.length?<p className="text-sm text-slate-500">No low-performing members.</p>:<ul className="space-y-2">{d.lowMembers.map(e=><li key={e.id}><button onClick={()=>onSelect({tl:e.tlId,ex:e.id})} className="w-full text-left rounded-lg bg-slate-50 ring-1 ring-slate-200 px-3 py-2 text-sm hover:ring-amber-300 transition"><b>{e.name}</b> · {e.tlName}<span className="block text-xs text-slate-500">↓ {e.achievement.toFixed(1)}% · {inr(e.pending)} remaining</span></button></li>)}</ul>}</div></div></Card>;
}
