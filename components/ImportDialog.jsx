import {useEffect,useState} from "react";
import {AlertCircle,CheckCircle2,Download,FileUp,Trash2,X} from "lucide-react";
import {Btn} from "./Ui";
import {TEMPLATE,validateImport} from "../utils/importCsv";
import {fmtDate,inr} from "../utils/formatters";
import {executives} from "../data/executiveData";

export default function ImportDialog({open,onClose,onImport,importedTotal,onClear}){
  const [res,setRes]=useState(null),[name,setName]=useState(""),[done,setDone]=useState(""),[drag,setDrag]=useState(false);
  useEffect(()=>{if(!open){setRes(null);setName("");setDone("")}},[open]);
  useEffect(()=>{if(!open)return;const h=e=>e.key==="Escape"&&onClose();window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[open,onClose]);
  if(!open)return null;
  const read=async file=>{if(!file)return;setDone("");setName(file.name);setRes(validateImport(await file.text()))};
  const template=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([TEMPLATE],{type:"text/csv"}));a.download="collection-import-template.csv";a.click()};
  const confirm=()=>{onImport(res.records);setDone(`${res.records.length} rows imported and highlighted as New data.`);setRes(null);setName("")};
  const exName=id=>executives.find(e=>e.id===id)?.name;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 backdrop-blur-[2px] p-4 animate-fade" onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 animate-fadeUp">
      <div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold">Import collection data</h2>
        <p className="text-sm text-slate-500 mt-0.5">Upload a CSV with one row per executive per date. Existing rows for the same date and executive are replaced.</p></div>
        <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18}/></button></div>
      <label onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);read(e.dataTransfer.files[0])}}
        className={`mt-5 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition ${drag?"border-violet-500 bg-violet-50":"border-slate-300 hover:border-violet-400 hover:bg-slate-50"}`}>
        <FileUp className="text-violet-600"/><span className="text-sm font-medium">{name||"Choose a CSV file or drag it here"}</span>
        <span className="text-xs text-slate-500">Required: date, userId, target, collected · Optional: contactedAccounts, connectedAccounts, ptpCount, ptpAmount, ptpKept, paidAccounts</span>
        <input type="file" accept=".csv,text/csv" className="hidden" onChange={e=>{read(e.target.files[0]);e.target.value=""}}/></label>
      {done&&<p className="mt-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3"><CheckCircle2 size={16}/>{done}</p>}
      {res&&<div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-3 text-sm"><span className="rounded-lg bg-emerald-50 text-emerald-700 px-3 py-1.5">{res.records.length} valid rows</span><span className={`rounded-lg px-3 py-1.5 ${res.errors.length?"bg-red-50 text-red-700":"bg-slate-50 text-slate-500"}`}>{res.errors.length} errors</span></div>
        {res.errors.length>0&&<ul className="text-xs text-red-700 bg-red-50 rounded-lg p-3 space-y-1 max-h-32 overflow-y-auto">{res.errors.slice(0,20).map((e,i)=><li key={i} className="flex gap-1.5"><AlertCircle size={12} className="mt-0.5 shrink-0"/>Line {e.line}: {e.msg}</li>)}{res.errors.length>20&&<li>…and {res.errors.length-20} more</li>}</ul>}
        {res.records.length>0&&<div className="overflow-x-auto rounded-lg ring-1 ring-slate-100"><table className="w-full text-xs"><thead className="text-slate-500"><tr>{["Date","Executive","Target","Collected"].map(h=><th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead><tbody>
          {res.records.slice(0,5).map(r=><tr key={r.date+r.execId} className="border-t border-slate-50"><td className="px-3 py-1.5">{fmtDate(r.date)}</td><td className="px-3">{exName(r.execId)}</td><td className="px-3">{inr(r.target)}</td><td className="px-3">{inr(r.collected)}</td></tr>)}</tbody></table></div>}
        <button disabled={!res.records.length} onClick={confirm} className="w-full rounded-lg bg-violet-600 text-white font-medium py-2.5 hover:bg-violet-700 disabled:opacity-40 transition">Import {res.records.length} valid rows</button></div>}
      <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4">
        <Btn onClick={template} className="inline-flex items-center gap-1.5"><Download size={14}/>Download template</Btn>
        {importedTotal>0&&<Btn onClick={()=>{onClear();setDone("All imported rows removed.")}} className="inline-flex items-center gap-1.5 text-red-600"><Trash2 size={14}/>Remove {importedTotal} imported rows</Btn>}</div></div></div>;
}
