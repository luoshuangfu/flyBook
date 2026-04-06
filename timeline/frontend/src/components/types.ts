export type TaskStatus = "running" | "done" | "paused";

export interface Task {
  id: string;
  title: string;
  category: string;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  status: TaskStatus;
}

export interface TimeBlock {
  label: string;
  start: Date;
  end: Date;
}

export const categories = [
  "学习",
  "工作",
  "生活",
  "通勤",
  "运动",
  "休息"
];

export function inferCategory(title: string): string {
  const lower = title.toLowerCase();
  if (/[\u5b66\u4e60]|study|read|paper|论文|写作/.test(lower)) return "学习";
  if (/work|client|开发|需求|会议/.test(lower)) return "工作";
  if (/run|gym|运动|跑步/.test(lower)) return "运动";
  if (/bus|metro|通勤|地铁/.test(lower)) return "通勤";
  if (/sleep|休息|nap|冥想/.test(lower)) return "休息";
  return "生活";
}

export function buildDayBlocks(baseDate: Date): TimeBlock[] {
  const blocks: TimeBlock[] = [];
  const dayStart = new Date(baseDate);
  dayStart.setHours(0, 0, 0, 0);

  for (let i = 0; i < 96; i += 1) {
    const start = new Date(dayStart.getTime() + i * 15 * 60 * 1000);
    const end = new Date(start.getTime() + 15 * 60 * 1000);
    const label = start.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit"
    });
    blocks.push({ label, start, end });
  }

  return blocks;
}

export function formatDuration(startIso: string, endIso?: string): string {
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  const mins = Math.max(1, Math.round((end - start) / 60000));
  if (mins < 60) return `${mins} 分钟`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} 小时 ${m} 分钟`;
}
