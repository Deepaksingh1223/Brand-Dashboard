const ok=n=>Number.isFinite(n);
export const num=n=>ok(n)?n.toLocaleString("en-IN"):"0";
export const inr=n=>{if(!ok(n))return"₹0";const a=Math.abs(n);
  if(a>=1e7)return`₹${(n/1e7).toFixed(2)} Cr`;if(a>=1e5)return`₹${(n/1e5).toFixed(2)} L`;return`₹${Math.round(n).toLocaleString("en-IN")}`};
export const pct=(a,b)=>b>0&&ok(a/b)?`${((a/b)*100).toFixed(1)}%`:"0.0%";
export const fmtDate=iso=>{const d=new Date(`${iso}T00:00:00`);return isNaN(d)?"-":d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})};
export const monthLabel=ym=>{const d=new Date(`${ym}-01T00:00:00`);return isNaN(d)?"-":d.toLocaleDateString("en-US",{month:"long",year:"numeric"})};
export const addDays=(iso,n)=>{const d=new Date(`${iso}T00:00:00`);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
