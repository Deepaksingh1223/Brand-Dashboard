import {executives,rng} from "./executiveData";
export const FLOW=["target","collected","contactedAccounts","connectedAccounts","ptpCount","ptpAmount","ptpKept","paidAccounts"];
// Month setup. Oct 2026 = 1–6 Oct (month to date) and equals the executive totals in executiveData.js.
const MONTHS=[{ym:"2026-08",days:31,c:0.78,v:0.85},{ym:"2026-09",days:30,c:0.9,v:0.95},{ym:"2026-10",days:6,c:1,v:1}];
// Largest-remainder split: parts are integers and always sum exactly to total.
function dist(total,w){const s=w.reduce((a,b)=>a+b,0),raw=w.map(x=>total*x/s),fl=raw.map(Math.floor);
  let rem=total-fl.reduce((a,b)=>a+b,0);raw.map((x,i)=>[x-fl[i],i]).sort((a,b)=>b[0]-a[0]).slice(0,rem).forEach(([,i])=>fl[i]++);return fl}
function build(){
  const r=rng(99),out=[];
  executives.forEach(e=>MONTHS.forEach(m=>{
    const cnt=Math.round(e.ptpCount*m.v),T={target:e.target,collected:Math.round(e.collected*m.c),contactedAccounts:Math.round(e.contactedAccounts*m.v),
      connectedAccounts:Math.round(e.connectedAccounts*m.v),ptpCount:cnt,ptpAmount:cnt*18000,ptpKept:Math.min(Math.round(e.ptpKept*m.v),cnt),paidAccounts:Math.round(e.paidAccounts*m.v)};
    const w=Array.from({length:m.days},()=>0.5+r());
    const parts={};FLOW.forEach(k=>{parts[k]=dist(T[k],k==="target"?w.map(()=>1):w)});
    for(let d=0;d<m.days;d++){const rec={date:`${m.ym}-${String(d+1).padStart(2,"0")}`,execId:e.id,imported:false};FLOW.forEach(k=>{rec[k]=parts[k][d]});out.push(rec)}
  }));
  return out;
}
export const baseDaily=build();
