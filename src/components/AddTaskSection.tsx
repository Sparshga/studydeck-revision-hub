
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type AddTaskSectionProps = {
  availableLabels: string[];
  onAddTask: (task: string, label?: string) => void;
};

const AddTaskSection: React.FC<AddTaskSectionProps> = ({
  availableLabels,
  onAddTask,
}) => {
  const [input, setInput] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string>("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onAddTask(trimmed, selectedLabel || undefined);
    setInput("");
  };

  return (
    <form className="flex flex-col gap-2 mt-2" onSubmit={handleAdd}>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Task description"
          className="border bg-white py-1 px-2 rounded min-w-[150px] text-sm"
          aria-label="New task"
        />
        {availableLabels.length > 0 && (
          <select
            className="border bg-white py-1 px-2 rounded text-sm min-w-[100px]"
            value={selectedLabel}
            onChange={e => setSelectedLabel(e.target.value)}
            aria-label="Choose label"
          >
            <option value="">No label</option>
            {availableLabels.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
        <Button size="sm" type="submit">Add Task</Button>
      </div>
    </form>
  );
};

export default AddTaskSection;
