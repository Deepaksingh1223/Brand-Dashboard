import {Card,Badge,Empty,TD,TH,Pill} from "./Ui";
import {fmtDate,inr,monthLabel} from "../utils/formatters";
const short=n=>n>=1e7?`${(n/1e7).toFixed(1)}Cr`:n>=1e5?`${(n/1e5).toFixed(0)}L`:`${Math.round(n/1e3)}k`;

function Chart({rows,onPick}){
  const L=44,R=8,T=10,B=24,W=700,H=230,n=rows.length,bw=(W-L-R)/n,max=Math.max(...rows.flatMap(d=>[d.target,d.collected]),1),y=v=>T+(H-T-B)*(1-v/max);
  return <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Daily target vs collection">
    {[0,.5,1].map(g=><g key={g}><line x1={L} x2={W-R} y1={y(max*g)} y2={y(max*g)} stroke="#e2e8f0"/><text x={L-6} y={y(max*g)+4} textAnchor="end" fontSize="10" fill="#64748b">{short(max*g)}</text></g>)}
    {rows.map((d,i)=>{const x=L+i*bw,w=Math.max(bw*0.36,1.5);return <g key={d.date} onClick={()=>onPick(d.date)} className="cursor-pointer">
      <title>{`${fmtDate(d.date)} — Target ${inr(d.target)}, Collected ${inr(d.collected)}${d.importedCount?" (imported)":""}`}</title>
      <rect x={x+bw*0.1} y={y(d.target)} width={w} height={H-B-y(d.target)} fill="#cbd5e1" rx="1"/>
      <rect x={x+bw*0.1+w+1} y={y(d.collected)} width={w} height={H-B-y(d.collected)} fill={d.importedCount?"#7c3aed":"#4f46e5"} rx="1"/>
      {(i===0||i===n-1||i===Math.floor(n/2))&&<text x={x+bw/2} y={H-8} textAnchor="middle" fontSize="10" fill="#64748b">{fmtDate(d.date).slice(0,6)}</text>}</g>})}</svg>;
}
export function DailyData({rows,onPick}){
  return <Card title="Date-wise Performance" subtitle="Click a bar or row to focus on a single date">
    {!rows.length?<Empty/>:<>
    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-2"><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-slate-300"/>Target</span><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-indigo-600"/>Collected</span><span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-violet-600"/>Imported day</span></div>
    <Chart rows={rows} onPick={onPick}/>
    <div className="mt-4 overflow-auto max-h-80 rounded-lg ring-1 ring-slate-100"><table className="w-full text-sm"><thead className="sticky top-0 bg-white shadow-[0_1px_0_#f1f5f9]"><tr>
      {["Date","Target","Collection","Remaining","Ach %","Top performer","Best TL","Source"].map(h=><th key={h} className={TH}>{h}</th>)}</tr></thead><tbody>
      {rows.map(d=><tr key={d.date} onClick={()=>onPick(d.date)} className={`border-t border-slate-50 cursor-pointer hover:bg-indigo-50/40 transition ${d.importedCount?"bg-violet-50/60 border-l-2 border-l-violet-500":""}`}>
        <td className={TD+" font-medium"}>{fmtDate(d.date)}</td><td className={TD}>{inr(d.target)}</td><td className={TD}>{inr(d.collected)}</td><td className={TD}>{inr(d.pending)}</td>
        <td className={TD}>{d.achievement.toFixed(1)}%</td><td className={TD}>{d.topMember}</td><td className={TD}>{d.bestTL}</td>
        <td className={TD}>{d.importedCount?<Pill>Imported · {d.importedCount}</Pill>:<span className="text-slate-400">Historical</span>}</td></tr>)}</tbody></table></div></>}</Card>;
}
export function MonthlyTrend({rows}){
  const max=Math.max(...rows.map(r=>Math.max(r.target,r.collected)),1);
  return <Card title="Monthly Trend" subtitle="Collected vs target, growth over previous month">{!rows.length?<Empty/>:<div className="space-y-4">
    {rows.map(r=><div key={r.ym}><div className="flex flex-wrap items-center justify-between gap-2 text-sm"><b>{monthLabel(r.ym)} {r.importedCount>0&&<Pill>New data</Pill>}</b>
      <span className="text-xs text-slate-500">{inr(r.collected)} of {inr(r.target)} · {r.achievement.toFixed(1)}%{r.growth!=null&&<span className={r.growth>=0?"text-emerald-600":"text-amber-600"}> · {r.growth>=0?"↑":"↓"} {Math.abs(r.growth).toFixed(1)}%</span>}</span></div>
      <div className="mt-1.5 space-y-1"><div className="h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-300" style={{width:`${r.target/max*100}%`}}/></div>
        <div className="h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600 transition-all duration-700" style={{width:`${r.collected/max*100}%`}}/></div></div></div>)}</div>}</Card>;
}
