import {Card,Empty} from "./Ui";
import {fmtDate,inr} from "../utils/formatters";
const short=n=>n>=1e7?`${(n/1e7).toFixed(1)}Cr`:n>=1e5?`${(n/1e5).toFixed(0)}L`:`${Math.round(n/1e3)}k`;
export function TeamChart({rows}){
  const W=700,H=230,L=44,B=40,T=10,n=rows.length,bw=(W-L-8)/Math.max(n,1),max=Math.max(...rows.flatMap(r=>[r.target,r.collected]),1),y=v=>T+(H-T-B)*(1-v/max);
  return <Card title="Team Performance Chart" subtitle="Target vs collection by team">{!n?<Empty/>:<svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
    {[0,.5,1].map(g=><g key={g}><line x1={L} x2={W-8} y1={y(max*g)} y2={y(max*g)} stroke="#e2e8f0"/><text x={L-6} y={y(max*g)+4} textAnchor="end" fontSize="10" fill="#64748b">{short(max*g)}</text></g>)}
    {rows.map((r,i)=>{const x=L+i*bw,w=Math.min(bw*0.3,48);return <g key={r.id}><title>{`${r.team}: target ${inr(r.target)}, collection ${inr(r.collected)}`}</title>
      <rect x={x+bw/2-w-2} y={y(r.target)} width={w} height={H-B-y(r.target)} fill="#cbd5e1" rx="2"/><rect x={x+bw/2+2} y={y(r.collected)} width={w} height={H-B-y(r.collected)} fill={r.tier==="top"?"#059669":r.tier==="low"?"#94a3b8":"#4f46e5"} rx="2"/>
      <text x={x+bw/2} y={H-22} textAnchor="middle" fontSize="11" fill="#334155">{r.team}</text><text x={x+bw/2} y={H-8} textAnchor="middle" fontSize="10" fill="#64748b">{r.achievement.toFixed(1)}%</text></g>})}</svg>}</Card>;
}
export function TrendChart({rows}){
  const W=700,H=200,L=40,R=12,T=12,B=24,n=rows.length,max=Math.max(100,...rows.map(r=>r.achievement)),x=i=>L+(n<2?(W-L-R)/2:i*(W-L-R)/(n-1)),y=v=>T+(H-T-B)*(1-v/max);
  return <Card title="Achievement Trend" subtitle="Daily target achievement %">{!n?<Empty/>:<svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
    {[0,50,100].map(g=><g key={g}><line x1={L} x2={W-R} y1={y(g)} y2={y(g)} stroke={g===100?"#a7f3d0":"#e2e8f0"} strokeDasharray={g===100?"4 3":""}/><text x={L-6} y={y(g)+4} textAnchor="end" fontSize="10" fill="#64748b">{g}%</text></g>)}
    <polyline fill="none" stroke="#4f46e5" strokeWidth="2" points={rows.map((r,i)=>`${x(i)},${y(r.achievement)}`).join(" ")}/>
    {rows.map((r,i)=><circle key={r.date} cx={x(i)} cy={y(r.achievement)} r={r.importedCount?4:2.5} fill={r.importedCount?"#7c3aed":"#4f46e5"}><title>{`${fmtDate(r.date)}: ${r.achievement.toFixed(1)}%`}</title></circle>)}
    <text x={L} y={H-6} fontSize="10" fill="#64748b">{fmtDate(rows[0].date).slice(0,6)}</text><text x={W-R} y={H-6} textAnchor="end" fontSize="10" fill="#64748b">{fmtDate(rows[n-1].date).slice(0,6)}</text></svg>}</Card>;
}
export function TopChart({rows}){
  const top=[...rows].sort((a,b)=>b.collected-a.collected).slice(0,5),max=Math.max(...top.map(r=>r.collected),1);
  return <Card title="Top Performers" subtitle="Highest collection among members">{!top.length?<Empty/>:<div className="space-y-3">{top.map((r,i)=><div key={r.id}>
    <div className="flex justify-between text-sm mb-1"><span className="font-medium">{["🏆","🥈","🥉","#4","#5"][i]} {r.name} <span className="text-xs text-slate-400">{r.tlName}</span></span><span className="tabular-nums text-slate-600">{inr(r.collected)} · {r.achievement.toFixed(1)}%</span></div>
    <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{width:`${r.collected/max*100}%`}}/></div></div>)}</div>}</Card>;
}
