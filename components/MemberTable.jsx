import {useEffect,useMemo,useState} from "react";
import {Trophy} from "lucide-react";
import {Badge,Btn,Card,Pager,Pill,TierTag,TD,TH,medal} from "./Ui";
import {inr} from "../utils/formatters";
import {downloadCSV} from "../utils/csv";
const COLS=[["name","Member"],["userId","User ID"],["tlName","TL"],["team","Team"],["target","Target"],["collected","Collection"],["pending","Remaining"],["achievement","Ach %"]];
const TABS=[["","All"],["top","Top"],["avg","Average"],["low","Low"]];
export default function MemberTable({rows,onSelect}){
  const [sort,setSort]=useState({k:"achievement",d:-1}),[pg,setPg]=useState(0),[size,setSize]=useState(10),[tier,setTier]=useState("");
  useEffect(()=>setPg(0),[rows,tier]);
  const ranked=useMemo(()=>[...rows].sort((a,b)=>b.achievement-a.achievement).map((e,i)=>({...e,rank:i+1})),[rows]);
  const list=useMemo(()=>ranked.filter(e=>!tier||e.tier===tier).sort((a,b)=>(typeof a[sort.k]==="string"?a[sort.k].localeCompare(b[sort.k]):a[sort.k]-b[sort.k])*sort.d),[ranked,tier,sort]);
  const topC=[...rows].sort((a,b)=>b.collected-a.collected)[0],topA=ranked[0],pages=Math.max(1,Math.ceil(list.length/size)),view=list.slice(pg*size,pg*size+size);
  const csv=list.map(e=>({Rank:e.rank,Member:e.name,UserID:e.userId,TL:e.tlName,Team:e.team,Target:e.target,Collection:e.collected,Remaining:e.pending,AchievementPct:e.achievement.toFixed(2),Status:e.status}));
  return <Card title="Individual Performance" subtitle="Click a member to focus" right={<Btn onClick={()=>downloadCSV(csv,"team-members.csv")}>Export CSV</Btn>}>
    {topC&&<div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm"><div className="rounded-lg bg-emerald-50 ring-1 ring-emerald-100 px-3 py-2">Highest collection: <b>{topC.name}</b> · {inr(topC.collected)}</div><div className="rounded-lg bg-emerald-50 ring-1 ring-emerald-100 px-3 py-2">Highest achievement: <b>{topA.name}</b> · {topA.achievement.toFixed(1)}%</div></div>}
    <div className="flex flex-wrap gap-2 mb-3">{TABS.map(([v,l])=><button key={l} onClick={()=>setTier(v)} className={`px-3 py-1 rounded-full text-xs font-medium transition ${tier===v?"bg-slate-900 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{l} {v?ranked.filter(e=>e.tier===v).length:ranked.length}</button>)}</div>
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b border-slate-100"><tr><th className={TH}>Rank</th>
      {COLS.map(([k,l])=><th key={k} onClick={()=>setSort(s=>({k,d:s.k===k?-s.d:-1}))} className={TH+" cursor-pointer select-none hover:text-slate-800"}>{l}{sort.k===k?(sort.d>0?" ▲":" ▼"):""}</th>)}<th className={TH}>Status</th></tr></thead><tbody>
      {view.map(e=><tr key={e.id} onClick={()=>onSelect(e)} className={`border-b border-slate-50 last:border-0 cursor-pointer transition hover:bg-indigo-50/40 ${e.importedCount>0?"bg-violet-50/60 border-l-2 border-l-violet-500":e.tier==="top"?"bg-emerald-50/40":e.tier==="low"?"text-slate-500":""}`}>
        <td className={TD}>{medal(e.rank)}</td><td className={TD+" font-medium"}>{e.rank===1&&<Trophy size={13} className="inline mr-1 text-amber-500"/>}{e.name}{e.importedCount>0&&<span className="ml-2"><Pill>New data</Pill></span>}</td>
        <td className={TD}>{e.userId}</td><td className={TD}>{e.tlName}</td><td className={TD}>{e.team}</td><td className={TD}>{inr(e.target)}</td><td className={TD}>{inr(e.collected)}</td><td className={TD}>{inr(e.pending)}</td><td className={TD}>{e.achievement.toFixed(1)}%</td>
        <td className={TD}><div className="flex flex-col gap-0.5"><Badge t={e.status}/><TierTag tier={e.tier}/></div></td></tr>)}</tbody></table></div>
    <Pager pg={pg} pages={pages} set={setPg} size={size} setSize={s=>{setSize(s);setPg(0)}}/></Card>;
}
