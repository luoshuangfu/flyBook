import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { Task, formatDuration } from "./types";

interface TaskCardProps {
  task: Task;
  onStop: (taskId: string) => void;
  onDone: (taskId: string) => void;
  className?: string;
  style?: CSSProperties;
  onResizeStart?: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

const statusLabels: Record<Task["status"], string> = {
  running: "进行中",
  paused: "已暂停",
  done: "已完成"
};

export default function TaskCard({
  task,
  onStop,
  onDone,
  className,
  style,
  onResizeStart
}: TaskCardProps) {
  const categoryClass =
    task.category === "学习" ? "task-card__category task-card__category--study" : "task-card__category";

  return (
    <div className={`task-card task-card--${task.status} ${className ?? ""}`.trim()} style={style}>
      <div className="task-card__header">
        <span className="task-card__title">{task.title}</span>
        <span className={categoryClass}>{task.category}</span>
      </div>
      <div className="task-card__meta">
        <span>{formatDuration(task.startTime, task.endTime)}</span>
        <span className={`task-card__status task-card__status--${task.status}`}>
          {statusLabels[task.status]}
        </span>
      </div>
      <div
        className="task-card__resize"
        onPointerDown={onResizeStart}
        role="separator"
        aria-label="调整任务时长"
      />
    </div>
  );
}
