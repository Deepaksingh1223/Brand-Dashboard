import {incentiveRules,performanceBands as pb} from "../data/dashboardData";
const K=["target","collected","allocatedAccounts","contactedAccounts","connectedAccounts","ptpCount","ptpAmount","ptpKept","ptpBroken","paidAccounts"];
export const ach=(c,t)=>t>0&&Number.isFinite(c/t)?(c/t)*100:0;
export function agg(rows){
  const s={};K.forEach(k=>{s[k]=rows.reduce((a,e)=>a+(e[k]||0),0)});
  s.pending=Math.max(s.target-s.collected,0);s.achievement=ach(s.collected,s.target);s.pendingAccounts=Math.max(s.allocatedAccounts-s.paidAccounts,0);
  s.ptpRate=s.ptpCount>0?(s.ptpKept/s.ptpCount)*100:0;s.efficiency=s.allocatedAccounts>0?Math.min((s.paidAccounts/s.allocatedAccounts)*100,100):0;return s;
}
export const tierOf=a=>a>=pb.good?"top":a>=pb.average?"avg":"low";
export const status=a=>a>=pb.excellent?"Excellent":a>=pb.good?"Good":a>=pb.average?"Average":"Needs Attention";
export const incentive=(c,a)=>{const s=incentiveRules.slabs.find(x=>a>=x.min);return Math.round(c*(s?s.rate:0)/100)+(incentiveRules.bonus||0)};
export function groupTL(execs,tls){
  return tls.map(tl=>{const rows=execs.filter(e=>e.tlId===tl.id);return{id:tl.id,name:tl.name,team:tl.team,userId:tl.userId,...agg(rows),teamSize:rows.length}}).filter(t=>t.teamSize>0)
   .sort((a,b)=>b.achievement-a.achievement).map((t,i)=>({...t,rank:i+1,status:status(t.achievement)}));
}
