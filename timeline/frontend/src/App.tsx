import { useMemo, useState } from "react";
import VoiceInput from "./components/VoiceInput";
import Timeline from "./components/Timeline";
import { Task, buildDayBlocks, inferCategory } from "./components/types";

const todayLabel = new Date().toLocaleDateString("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
});

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t-1",
      title: "写论文提纲",
      category: "学习",
      startTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
      status: "done"
    },
    {
      id: "t-2",
      title: "和客户对齐需求",
      category: "工作",
      startTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(11, 45, 0, 0)).toISOString(),
      status: "done"
    }
  ]);

  const blocks = useMemo(() => buildDayBlocks(new Date()), []);

  const handleNewTask = (title: string) => {
    const now = new Date();
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title,
      category: inferCategory(title),
      startTime: now.toISOString(),
      status: "running"
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const stopTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: "paused", endTime: new Date().toISOString() }
          : task
      )
    );
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: "done", endTime: new Date().toISOString() }
          : task
      )
    );
  };

  const totalDone = tasks.filter((task) => task.status === "done").length;
  const running = tasks.filter((task) => task.status === "running").length;

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>柳比歇夫时间轴</h1>
          <p className="app__subtitle">{todayLabel} · 记录真实时间，回看每一次投入</p>
        </div>
        <div className="app__stats">
          <div>
            <span className="stat__label">完成</span>
            <span className="stat__value">{totalDone}</span>
          </div>
          <div>
            <span className="stat__label">进行中</span>
            <span className="stat__value">{running}</span>
          </div>
        </div>
      </header>

      <section className="app__input">
        <VoiceInput onSubmit={handleNewTask} />
      </section>

      <main className="app__main">
        <Timeline blocks={blocks} tasks={tasks} onStop={stopTask} onDone={completeTask} />
        <aside className="app__aside">
          <div className="card">
            <h2>今日复盘</h2>
            <p>学习时间占比偏低，建议晚上补 30 分钟。</p>
            <div className="chart">
              <div className="chart__bar" style={{ width: "65%" }}>
                深度工作 65%
              </div>
              <div className="chart__bar" style={{ width: "35%" }}>
                生活/通勤 35%
              </div>
            </div>
          </div>

          <div className="card">
            <h2>日历</h2>
            <div className="calendar">
              <div className="calendar__day is-active">今天</div>
              <div className="calendar__day">昨天</div>
              <div className="calendar__day">本周一</div>
            </div>
            <p className="calendar__hint">点击日期查看历史时间轴。</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
