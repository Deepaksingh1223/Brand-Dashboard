import {executives} from "../data/executiveData";
import {FLOW} from "../data/dailyData";
export function parseCSV(text){
  const rows=[];let row=[],cur="",q=false;text=text.replace(/^\uFEFF/,"");
  const end=()=>{row.push(cur);cur="";if(row.some(x=>x.trim()!==""))rows.push(row);row=[]};
  for(let i=0;i<text.length;i++){const c=text[i];
    if(q){if(c==='"'){if(text[i+1]==='"'){cur+='"';i++}else q=false}else cur+=c}
    else if(c==='"')q=true;else if(c===","){row.push(cur);cur=""}
    else if(c==="\n"||c==="\r"){if(c==="\r"&&text[i+1]==="\n")i++;end()}else cur+=c}
  end();return rows;
}
const ALIAS={date:"date",userid:"userId",executiveid:"userId",target:"target",collected:"collected",contacted:"contactedAccounts",contactedaccounts:"contactedAccounts",
  connected:"connectedAccounts",connectedaccounts:"connectedAccounts",ptpcount:"ptpCount",ptp:"ptpCount",ptpamount:"ptpAmount",ptpkept:"ptpKept",paid:"paidAccounts",paidaccounts:"paidAccounts"};
const normDate=s=>{s=s.trim();let m;
  if((m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)))return`${m[1]}-${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}`;
  if((m=s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)))return`${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;return null};
const valid=iso=>iso&&!isNaN(new Date(`${iso}T00:00:00`))&&new Date(`${iso}T00:00:00`).toISOString().slice(0,10)===iso;
export function validateImport(text){
  const table=parseCSV(text),errors=[],map=new Map();
  if(table.length<2)return{records:[],errors:[{line:1,msg:"File has no data rows"}]};
  const cols=table[0].map(h=>ALIAS[h.toLowerCase().replace(/[^a-z0-9]/g,"")]||null);
  const miss=["date","userId","target","collected"].filter(k=>!cols.includes(k));
  if(miss.length)return{records:[],errors:[{line:1,msg:`Missing required column(s): ${miss.join(", ")}`}]};
  const byUser=new Map(executives.map(e=>[e.userId.toLowerCase(),e]));
  table.slice(1).forEach((cells,i)=>{
    const line=i+2,o={};cols.forEach((c,j)=>{if(c)o[c]=(cells[j]??"").trim()});
    const ex=byUser.get((o.userId||"").toLowerCase()),date=normDate(o.date||"");
    if(!ex)return errors.push({line,msg:`Unknown user ID "${o.userId||""}"`});
    if(!valid(date))return errors.push({line,msg:`Invalid date "${o.date||""}"`});
    const rec={date,execId:ex.id,imported:true,importedAt:new Date().toISOString()};
    for(const k of FLOW){const raw=(o[k]??"").replace(/[₹,\s]/g,"");const n=raw===""?0:Number(raw);
      if(!Number.isFinite(n)||n<0)return errors.push({line,msg:`Invalid number in "${k}"`});rec[k]=Math.round(n)}
    if(rec.ptpKept>rec.ptpCount)return errors.push({line,msg:"ptpKept cannot exceed ptpCount"});
    map.set(`${date}|${ex.id}`,rec);
  });
  return{records:[...map.values()],errors};
}
export const TEMPLATE="date,userId,target,collected,contactedAccounts,connectedAccounts,ptpCount,ptpAmount,ptpKept,paidAccounts\n"+
 executives.slice(0,3).map((e,i)=>`2026-10-07,${e.userId},${600000+i*50000},${420000+i*30000},80,55,20,360000,12,30`).join("\n")+"\n";
