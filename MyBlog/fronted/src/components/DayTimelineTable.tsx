import type { DayItem } from "../types";

type Props = {
  items: DayItem[];
};

function DayTimelineTable({ items }: Props) {
  return (
    <div className="hand-drawn-card timeline-wrap">
      <table className="timeline-table">
        <thead>
          <tr>
            <th>时间</th>
            <th>活动</th>
            <th>时长</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.time}-${index}`}>
              <td>{item.time}</td>
              <td>{item.activity}</td>
              <td>{item.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DayTimelineTable;
