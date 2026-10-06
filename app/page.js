"use client";
import { useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import DashboardHeader from "../components/DashboardHeader";
import FilterBar from "../components/FilterBar";
import BrandProgress from "../components/BrandProgress";
import KPICards from "../components/KPICards";
import { TeamPerformance, TLPerformance } from "../components/TeamPerformance";
import MemberTable from "../components/MemberTable";
import { TeamChart, TrendChart, TopChart } from "../components/Charts";
import { DailyData, MonthlyTrend } from "../components/DailyData";
import AttentionPanel from "../components/AttentionPanel";
import SummaryModal from "../components/SummaryModal";
import ImportDialog from "../components/ImportDialog";
import { Card, Empty, Skeleton } from "../components/Ui";

export default function Page() {
  const d = useDashboard(), [importing, setImporting] = useState(false);
  const openImport = () => { d.setShowSummary(false); setImporting(true) };
  return <>
    <DashboardHeader stamp={d.stamp} period={d.periodLabel} importedTotal={d.importedTotal} onRefresh={d.refresh} onImport={openImport} onSummary={() => d.setShowSummary(true)} />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <FilterBar f={d.f} set={d.set} reset={d.reset} resetDates={d.resetDates} months={d.months} bounds={d.bounds} />
      {!d.ready ? <Skeleton /> : !d.execRows.length ? <Card title="Performance"><Empty /></Card> : <>
        <BrandProgress t={d.total} period={d.periodLabel} />
        <KPICards t={d.total} tlRows={d.tlRows} members={d.insights.members} imported={d.insights.impRecs} />
        <TeamPerformance rows={d.tlRows} />
        <div className="grid gap-5 lg:grid-cols-2"><TLPerformance rows={d.tlRows} onSelect={id => d.set({ tl: id, ex: "" })} /><TeamChart rows={d.tlRows} /></div>
        <MemberTable rows={d.execRows} onSelect={e => d.set({ tl: e.tlId, ex: e.id })} />
        <div className="grid gap-5 lg:grid-cols-2"><TrendChart rows={d.daily} /><TopChart rows={d.execRows} /></div>
        <div className="grid gap-5 lg:grid-cols-3 overflow-x-auto">
          <div className="lg:col-span-2">
            <DailyData rows={d.daily} onPick={x => d.set({ from: x, to: x, month: "" })} /></div>
          <MonthlyTrend rows={d.monthly} />
        </div>
        <AttentionPanel d={d.insights} onSelect={d.set} /></>}
    </main>
    {d.showSummary && <SummaryModal d={d.insights} onClose={() => d.setShowSummary(false)} onImport={openImport} />}
    <ImportDialog open={importing} onClose={() => setImporting(false)} onImport={d.importRecords} importedTotal={d.importedTotal} onClear={d.clearImported} />
  </>;
}
