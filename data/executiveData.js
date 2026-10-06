import {TLS} from "./tlData";
import {head} from "./dashboardData";
export function rng(seed){let s=seed;return()=>((s=(s*16807)%2147483647)/2147483647)}
const names=["Rohit","Sneha","Vikram","Anjali","Karan","Pooja","Manish","Divya","Arjun","Neha","Sandeep","Ritu","Gaurav","Kavita","Deepak","Isha","Nitin","Swati","Yash","Meena","Tarun","Komal","Ajay","Priya","Sunil","Rekha","Vivek","Nisha","Harsh","Simran","Mohit","Payal","Lokesh"];
export const buckets=["0 DPD","1-30","31-60","61-90","90+"];
function build(){
  const r=rng(42),out=[];let n=0;
  TLS.forEach(tl=>{
    const w=Array.from({length:tl.teamSize},()=>0.6+r()*0.8),ws=w.reduce((a,b)=>a+b,0);
    let acc=0;const ts=w.map((x,i)=>{const v=i<w.length-1?Math.round(tl.target*x/ws):tl.target-acc;acc+=v;return v});
    const raw=ts.map(t=>t*(0.45+r()*0.5)),rs=raw.reduce((a,b)=>a+b,0);
    let ca=0;const cs=raw.map((x,i)=>{const v=i<raw.length-1?Math.round(x*tl.collected/rs):Math.round(tl.collected)-ca;ca+=v;return v});
    ts.forEach((t,i)=>{
      const alloc=Math.round(t/20000),contacted=Math.round(alloc*(0.7+r()*0.25)),connected=Math.round(contacted*(0.5+r()*0.3));
      const ptp=Math.round(connected*(0.3+r()*0.2)),kept=Math.round(ptp*(0.5+r()*0.3)),a=cs[i]/t;
      n++;out.push({id:`E${n}`,name:names[(n-1)%names.length],userId:`EX-${2000+n}`,tlId:tl.id,tlName:tl.name,headId:head.id,headName:head.name,
        allocatedAccounts:alloc,contactedAccounts:contacted,connectedAccounts:connected,ptpCount:ptp,ptpAmount:ptp*18000,ptpKept:kept,ptpBroken:ptp-kept,
        paidAccounts:Math.round(alloc*Math.min(a,1)*0.85),target:t,collected:cs[i],dpdBucket:buckets[Math.floor(r()*5)]});
    });
  });
  return out;
}
export const executives=build();
