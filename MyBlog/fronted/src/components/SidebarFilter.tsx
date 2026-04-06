import type { LabelValue } from "../types";

type Props = {
  title: string;
  items: LabelValue[];
  selected?: string;
  onSelect: (slug?: string) => void;
  variant: "category" | "tag";
};

function SidebarFilter({ title, items, selected, onSelect, variant }: Props) {
  return (
    <section className="hand-drawn-card sidebar-card">
      <h4>{title}</h4>
      <button
        className={`filter-btn filter-${variant}${selected ? "" : " active"}`}
        onClick={() => onSelect(undefined)}
      >
        全部
      </button>
      {items.map((item) => (
        <button
          key={item.id}
          className={`filter-btn filter-${variant}${selected === item.slug ? " active" : ""}`}
          onClick={() => onSelect(item.slug)}
        >
          {item.name}
        </button>
      ))}
    </section>
  );
}

export default SidebarFilter;
