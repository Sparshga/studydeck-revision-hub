
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

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
      <div className="flex gap-2 items-center">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Task description"
          className="border bg-white py-1 px-2 rounded min-w-[150px] text-sm"
          aria-label="New task"
        />
        {availableLabels.length > 0 ? (
          <Select
            value={selectedLabel}
            onValueChange={setSelectedLabel}
          >
            <SelectTrigger className="w-[110px] min-w-[110px]">
              <SelectValue placeholder="Choose label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="" value="">No label</SelectItem>
              {availableLabels.map(c => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-xs text-muted-foreground px-2 py-1">No labels</div>
        )}
        <Button size="sm" type="submit">Add Task</Button>
      </div>
    </form>
  );
};

export default AddTaskSection;
