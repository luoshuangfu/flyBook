import { useCallback, useMemo, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Task, TimeBlock } from "./types";
import TaskCard from "./TaskCard";

interface TimelineProps {
  blocks: TimeBlock[];
  tasks: Task[];
  onStop: (taskId: string) => void;
  onDone: (taskId: string) => void;
  onResize: (taskId: string, endTimeIso: string) => void;
}

const MINUTES_PER_BLOCK = 15;
const BLOCK_HEIGHT = 48;
const PX_PER_MINUTE = BLOCK_HEIGHT / MINUTES_PER_BLOCK;
const SNAP_MINUTES = 15;
const MIN_DURATION_MINUTES = 15;

export default function Timeline({ blocks, tasks, onStop, onDone, onResize }: TimelineProps) {
  const dragRef = useRef<{
    taskId: string;
    startY: number;
    startEndMs: number;
    startMs: number;
  } | null>(null);

  const dayStartMs = blocks[0]?.start.getTime() ?? 0;
  const dayEndMs = blocks[blocks.length - 1]?.end.getTime() ?? dayStartMs;
  const snapMs = SNAP_MINUTES * 60 * 1000;
  const minDurationMs = MIN_DURATION_MINUTES * 60 * 1000;

  const tasksInDay = useMemo(
    () =>
      tasks.filter((task) => {
        const start = new Date(task.startTime).getTime();
        return start >= dayStartMs && start < dayEndMs;
      }),
    [tasks, dayStartMs, dayEndMs]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const dragging = dragRef.current;
      if (!dragging) return;
      const deltaPx = event.clientY - dragging.startY;
      const deltaMinutes = deltaPx / PX_PER_MINUTE;
      const rawEndMs = dragging.startEndMs + deltaMinutes * 60 * 1000;
      let snappedEndMs = Math.round(rawEndMs / snapMs) * snapMs;
      const minEndMs = dragging.startMs + minDurationMs;
      if (snappedEndMs < minEndMs) snappedEndMs = minEndMs;
      if (snappedEndMs > dayEndMs) snappedEndMs = dayEndMs;
      onResize(dragging.taskId, new Date(snappedEndMs).toISOString());
    },
    [dayEndMs, minDurationMs, onResize, snapMs]
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener("pointermove", handlePointerMove);
  }, [handlePointerMove]);

  const handleResizeStart = useCallback(
    (task: Task) => (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const startMs = new Date(task.startTime).getTime();
      const endMs = task.endTime ? new Date(task.endTime).getTime() : Date.now();
      dragRef.current = {
        taskId: task.id,
        startY: event.clientY,
        startEndMs: endMs,
        startMs
      };
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp, { once: true });
    },
    [handlePointerMove, handlePointerUp]
  );

  const layoutFor = useCallback(
    (task: Task) => {
      const startMs = new Date(task.startTime).getTime();
      const rawEndMs = task.endTime ? new Date(task.endTime).getTime() : Date.now();
      const endMs = Math.min(rawEndMs, dayEndMs);
      const durationMinutes = Math.max(
        MIN_DURATION_MINUTES,
        Math.round((endMs - startMs) / 60000)
      );
      const topMinutes = (startMs - dayStartMs) / 60000;
      const height = durationMinutes * PX_PER_MINUTE;
      const top = topMinutes * PX_PER_MINUTE;
      return { top, height };
    },
    [dayEndMs, dayStartMs]
  );

  return (
    <div className="timeline">
      <div className="timeline__grid">
        {blocks.map((block) => (
          <div className="timeline__row" key={block.start.toISOString()}>
            <div className="timeline__time">{block.label}</div>
            <div className="timeline__slot" />
          </div>
        ))}
        <div className="timeline__tasks">
          {tasksInDay.length === 0 ? (
            <div className="timeline__empty">—</div>
          ) : (
            tasksInDay.map((task) => {
              const { top, height } = layoutFor(task);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStop={onStop}
                  onDone={onDone}
                  className="timeline__task-card"
                  style={{ top: `${top}px`, height: `${height}px` }}
                  onResizeStart={handleResizeStart(task)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
