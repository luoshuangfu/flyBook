import { useEffect, useState } from "react";
import { fetchMyDay } from "../api/feishu";
import type { DayData } from "../types";
import DayTimelineTable from "../components/DayTimelineTable";

function DayPage() {
  const [dayData, setDayData] = useState<DayData | null>(null);

  useEffect(() => {
    fetchMyDay().then(setDayData);
  }, []);

  if (!dayData) {
    return <p>加载中...</p>;
  }

  return (
    <section>
      <div className="hand-drawn-card hero-card">
        <h2>{dayData.documentTitle}</h2>
        <p>
          数据源：{dayData.source} | 更新时间：{new Date(dayData.updatedAt).toLocaleString()}
        </p>
      </div>
      <DayTimelineTable items={dayData.items} />
    </section>
  );
}

export default DayPage;
