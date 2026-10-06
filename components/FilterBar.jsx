import {Btn,Sel} from "./Ui";
import {TLS} from "../data/tlData";
import {executives} from "../data/executiveData";
import {TODAY} from "../data/dashboardData";
import {addDays,monthLabel} from "../utils/formatters";
const box="mt-1 w-full rounded-lg bg-white ring-1 ring-slate-200 px-2.5 py-2 text-sm text-slate-900 hover:ring-slate-300 transition";
export default function FilterBar({f,set,reset,resetDates,months,bounds}){
  const custom=f.from||f.to,preset=(a,b)=>set({from:a,to:b,month:""});
  return <div className="bg-white rounded-xl ring-1 ring-slate-200/70 shadow-sm p-4 space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
      <label className="text-[11px] font-medium text-slate-500 min-w-0">Reporting month
        <select value={f.month} onChange={e=>set({month:e.target.value,from:"",to:""})} className={box}><option value="">{custom?"Custom range":"All months"}</option>{months.map(m=><option key={m} value={m}>{monthLabel(m)}</option>)}</select></label>
      <label className="text-[11px] font-medium text-slate-500 min-w-0">From date<input type="date" min={bounds.min} max={bounds.max} value={f.from} onChange={e=>set({from:e.target.value,month:""})} className={box}/></label>
      <label className="text-[11px] font-medium text-slate-500 min-w-0">To date<input type="date" min={bounds.min} max={bounds.max} value={f.to} onChange={e=>set({to:e.target.value,month:""})} className={box}/></label>
      <Sel label="Data source" v={f.src} set={v=>set({src:v})} opts={[{v:"imported",l:"Imported only"},{v:"historical",l:"Historical only"}]}/>
      <div className="col-span-2 flex flex-wrap gap-2"><Btn onClick={()=>preset(TODAY,TODAY)}>Today</Btn><Btn onClick={()=>preset(addDays(TODAY,-1),addDays(TODAY,-1))}>Yesterday</Btn><Btn onClick={()=>preset(addDays(TODAY,-6),TODAY)}>Last 7 days</Btn><Btn onClick={resetDates}>Reset dates</Btn></div></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end border-t border-slate-100 pt-4">
      <Sel label="Team / TL" v={f.tl} set={v=>set({tl:v,ex:""})} opts={TLS.map(t=>({v:t.id,l:`${t.team} · ${t.name}`}))}/>
      <Sel label="Team member" v={f.ex} set={v=>set({ex:v})} opts={executives.filter(e=>!f.tl||e.tlId===f.tl).map(e=>({v:e.id,l:e.name}))}/>
      <label className="col-span-2 md:col-span-1 min-w-0 text-[11px] font-medium text-slate-500">Search (member, user ID, TL, team)<input value={f.q} onChange={e=>set({q:e.target.value})} placeholder="Search…" className={box}/></label>
      <Btn onClick={reset}>Reset all</Btn></div></div>;
}
