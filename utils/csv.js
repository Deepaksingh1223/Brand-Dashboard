export function downloadCSV(rows,name){
  if(!rows.length)return;
  const keys=Object.keys(rows[0]).filter(k=>typeof rows[0][k]!=="object");
  const esc=v=>`"${String(v??"").replace(/"/g,'""')}"`;
  const csv=[keys.join(","),...rows.map(r=>keys.map(k=>esc(r[k])).join(","))].join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=name;a.click();URL.revokeObjectURL(a.href);
}
