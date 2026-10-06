"use client";
import {useCallback,useEffect,useMemo,useRef,useState} from "react";
import {TLS} from "../data/tlData";
import {executives} from "../data/executiveData";
import {baseDaily,FLOW} from "../data/dailyData";
import {DEFAULT_MONTH} from "../data/dashboardData";
import {agg,groupTL,status,ach,tierOf} from "../utils/calculations";
import {fmtDate,monthLabel} from "../utils/formatters";

const INIT={tl:"",ex:"",q:"",src:"",month:DEFAULT_MONTH,from:"",to:""};
const KEY="lcd.imported.v1",keyOf=r=>`${r.date}|${r.execId}`,srcOk=(s,r)=>!s||(s==="imported")===!!r.imported;
const teamOf=Object.fromEntries(TLS.map(t=>[t.id,t.team])),execById=Object.fromEntries(executives.map(e=>[e.id,e]));
const best=(o,k)=>Object.entries(o).sort((a,b)=>b[1][k]-a[1][k])[0];

export function useDashboard(){
  const [f,setF]=useState(INIT),[ready,setReady]=useState(false),[stamp,setStamp]=useState(""),[imported,setImported]=useState([]);
  const [showSummary,setShowSummary]=useState(false),shown=useRef(false);
  useEffect(()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||"[]");if(Array.isArray(s))setImported(s)}catch{}},[]);
  const persist=list=>{setImported(list);try{localStorage.setItem(KEY,JSON.stringify(list))}catch{}};
  const set=useCallback(p=>setF(x=>({...x,...p})),[]);
  const reset=useCallback(()=>setF(INIT),[]);
  const resetDates=useCallback(()=>setF(x=>({...x,month:DEFAULT_MONTH,from:"",to:""})),[]);
  const refresh=useCallback(()=>{setReady(false);setTimeout(()=>{setReady(true);setStamp(new Date().toLocaleTimeString())},450)},[]);
  useEffect(refresh,[refresh]);
  useEffect(()=>{if(ready&&!shown.current){shown.current=true;setShowSummary(true)}},[ready]);

  const records=useMemo(()=>{const m=new Map(baseDaily.map(r=>[keyOf(r),r]));imported.forEach(r=>m.set(keyOf(r),r));return[...m.values()]},[imported]);
  const months=useMemo(()=>[...new Set(records.map(r=>r.date.slice(0,7)))].sort(),[records]);
  const bounds=useMemo(()=>{const d=records.map(r=>r.date).sort();return{min:d[0]||"",max:d[d.length-1]||""}},[records]);
  const [lo,hi]=useMemo(()=>{let a,b;
    if(f.from||f.to){a=f.from||bounds.min;b=f.to||bounds.max}else if(f.month){a=`${f.month}-01`;b=`${f.month}-31`}else{a=bounds.min;b=bounds.max}
    return a<=b?[a,b]:[b,a]},[f.from,f.to,f.month,bounds]);
  const periodLabel=f.from||f.to?(lo===hi?fmtDate(lo):`${fmtDate(lo)} – ${fmtDate(hi)}`):f.month?monthLabel(f.month):"All dates";
  const q=f.q.trim().toLowerCase();

  const metaExecs=useMemo(()=>executives.filter(e=>(!f.tl||e.tlId===f.tl)&&(!f.ex||e.id===f.ex)&&(!q||[e.name,e.userId,e.tlName,teamOf[e.tlId]].some(x=>x.toLowerCase().includes(q)))),[f.tl,f.ex,q]);
  const ids=useMemo(()=>new Set(metaExecs.map(e=>e.id)),[metaExecs]);
  const winRecs=useMemo(()=>records.filter(r=>r.date>=lo&&r.date<=hi&&ids.has(r.execId)&&srcOk(f.src,r)),[records,lo,hi,ids,f.src]);

  const execRows=useMemo(()=>{const m=new Map();
    winRecs.forEach(r=>{let a=m.get(r.execId);if(!a){a={importedCount:0};FLOW.forEach(k=>a[k]=0);m.set(r.execId,a)}FLOW.forEach(k=>{a[k]+=r[k]||0});if(r.imported)a.importedCount++});
    return metaExecs.filter(e=>m.has(e.id)).map(e=>{const t={...e,...m.get(e.id),team:teamOf[e.tlId]};const x=ach(t.collected,t.target);
      return{...t,pending:Math.max(t.target-t.collected,0),achievement:x,status:status(x),tier:tierOf(x)}})},[winRecs,metaExecs]);
  const total=useMemo(()=>agg(execRows),[execRows]);
  const tlRows=useMemo(()=>groupTL(execRows,TLS).map(t=>({...t,tier:tierOf(t.achievement),avgPerMember:t.teamSize?t.collected/t.teamSize:0,
    importedCount:execRows.filter(e=>e.tlId===t.id).reduce((a,e)=>a+e.importedCount,0)})),[execRows]);

  const daily=useMemo(()=>{const m=new Map();
    winRecs.forEach(r=>{let d=m.get(r.date);if(!d){d={date:r.date,target:0,collected:0,importedCount:0,ex:{},tl:{}};m.set(r.date,d)}
      const e=execById[r.execId];d.target+=r.target;d.collected+=r.collected;if(r.imported)d.importedCount++;
      d.ex[r.execId]=d.ex[r.execId]||{c:0};d.ex[r.execId].c+=r.collected;d.tl[e.tlId]=d.tl[e.tlId]||{t:0,c:0,a:0};d.tl[e.tlId].t+=r.target;d.tl[e.tlId].c+=r.collected});
    return[...m.values()].sort((a,b)=>a.date.localeCompare(b.date)).map(d=>{Object.values(d.tl).forEach(x=>{x.a=ach(x.c,x.t)});
      const tm=best(d.ex,"c"),bt=best(d.tl,"a");
      return{date:d.date,target:d.target,collected:d.collected,importedCount:d.importedCount,pending:Math.max(d.target-d.collected,0),achievement:ach(d.collected,d.target),
        topMember:tm?execById[tm[0]].name:"-",bestTL:bt?TLS.find(t=>t.id===bt[0]).name:"-"}})},[winRecs]);
  const monthly=useMemo(()=>{const m={};
    records.forEach(r=>{if(!ids.has(r.execId)||!srcOk(f.src,r))return;const k=r.date.slice(0,7);m[k]=m[k]||{ym:k,target:0,collected:0,importedCount:0};m[k].target+=r.target;m[k].collected+=r.collected;if(r.imported)m[k].importedCount++});
    const L=Object.values(m).sort((a,b)=>a.ym.localeCompare(b.ym));
    return L.map((x,i)=>({...x,achievement:ach(x.collected,x.target),growth:i>0&&L[i-1].collected>0?(x.collected-L[i-1].collected)/L[i-1].collected*100:null}))},[records,ids,f.src]);

  const insights=useMemo(()=>{
    const v=execRows.filter(e=>e.target>0).sort((a,b)=>b.achievement-a.achievement),days=[...daily].sort((a,b)=>b.collected-a.collected),imp=winRecs.filter(r=>r.imported);
    return{periodLabel,total,tlRows,members:v,bestTL:tlRows[0],worstTL:tlRows.length>1?tlRows[tlRows.length-1]:null,
      top:v.slice(0,3),topCollector:[...execRows].sort((a,b)=>b.collected-a.collected)[0],
      lowTLs:tlRows.filter(t=>t.tier==="low"),lowMembers:v.filter(e=>e.tier==="low").slice(-5).reverse(),
      behind:[...tlRows].sort((a,b)=>b.pending-a.pending).slice(0,2),bestDay:days[0],lowDay:days.length>1?days[days.length-1]:null,
      impRecs:imp.length,impExecs:new Set(imp.map(r=>r.execId)).size,impDates:[...new Set(imp.map(r=>r.date))].sort(),impTotal:imported.length}},[execRows,daily,winRecs,tlRows,total,periodLabel,imported]);

  const importRecords=useCallback(recs=>{
    const m=new Map(imported.map(r=>[keyOf(r),r]));recs.forEach(r=>m.set(keyOf(r),r));persist([...m.values()]);
    const last=recs.map(r=>r.date).sort().pop();if(last)setF(x=>({...x,month:last.slice(0,7),from:"",to:"",src:""}));
  },[imported]);
  const clearImported=useCallback(()=>persist([]),[]);
  return{f,set,reset,resetDates,ready,stamp,refresh,months,bounds,periodLabel,execRows,total,tlRows,daily,monthly,insights,
    importedTotal:imported.length,importRecords,clearImported,showSummary,setShowSummary};
}
