import * as ToggleGroup from "@radix-ui/react-toggle-group";

type TagOption = {
  value: string;
  label: string;
};

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  options: TagOption[];
};

function AdminTagMultiSelect({ value, onChange, options }: Props) {
  return (
    <ToggleGroup.Root
      className="admin-tag-toggle-group"
      onValueChange={onChange}
      type="multiple"
      value={value}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          className="admin-tag-toggle-item"
          value={option.value}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

export default AdminTagMultiSelect;
