
import React, { useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AddMultipleTasksModal from "./AddMultipleTasksModal";

type DayType = "work" | "vacation" | "sickness";
const colorMap: Record<DayType, string> = {
  work: "bg-yellow-100 text-yellow-800",
  vacation: "bg-gray-100 text-gray-800",
  sickness: "bg-red-100 text-red-800",
};

interface TodayInfoBoxProps {
  dayType: DayType;
  events: string[];
  date: Date;
  doneMap: boolean[];
  onToggleDone: (eventIdx: number) => void;
  isToday: boolean;
  isSelected: boolean;
  onDayTypeChange: (t: DayType) => void;
  onAddEvent: (e: string) => void;
  onRemoveEvent: (i: number) => void;
  onAddTasks: (tasks: string[]) => void;
}

export default function TodayInfoBox({
  dayType,
  events,
  date,
  doneMap,
  onToggleDone,
  isToday,
  isSelected,
  onDayTypeChange,
  onAddEvent,
  onRemoveEvent,
  onAddTasks,
}: TodayInfoBoxProps) {
  // Remove input and inputRef, no longer needed for single line add
  // const [input, setInput] = useState("");
  // const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-card shadow rounded-lg p-4 flex flex-col min-w-[260px] gap-2">
      <div className="flex items-center mb-1">
        <div className={`px-2 py-1 rounded text-xs font-semibold capitalize ${colorMap[dayType]}`}>
          {dayType}
        </div>
        <div className="ml-auto font-medium text-xs text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      </div>
      {/* Day type selector, show if selected */}
      {isSelected && (
        <div className="mb-2">
          <div className="text-xs text-muted-foreground mb-1">Change Day Type</div>
          <RadioGroup
            value={dayType}
            onValueChange={(val) => onDayTypeChange(val as DayType)}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="work" id="side-work" />
              <label htmlFor="side-work" className="text-yellow-700 cursor-pointer">Work</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="vacation" id="side-vacation" />
              <label htmlFor="side-vacation" className="text-gray-700 cursor-pointer">Vacation</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="sickness" id="side-sickness" />
              <label htmlFor="side-sickness" className="text-red-700 cursor-pointer">Sickness</label>
            </div>
          </RadioGroup>
        </div>
      )}

      <div className="text-xs text-muted-foreground mb-1">
        Events for {isToday ? "today" : date.toLocaleDateString()}:
      </div>
      <ul className="space-y-1">
        {events.length ? (
          events.map((e, i) => (
            <li key={i} className="text-sm bg-muted rounded px-2 py-1 flex items-center gap-2">
              <Checkbox
                checked={!!doneMap[i]}
                onCheckedChange={() => onToggleDone(i)}
                className="border-green-500 mr-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                aria-label={doneMap[i] ? "Mark as not done" : "Mark as done"}
                id={`event-checkbox-${i}`}
              />
              {doneMap[i] && (
                <Check size={18} color="green" className="mr-1" />
              )}
              <span className={doneMap[i] ? "line-through text-gray-400" : ""}>{e}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-destructive"
                onClick={() => onRemoveEvent(i)}
                aria-label="Remove"
                title="Remove"
              >
                ✕
              </Button>
            </li>
          ))
        ) : (
          <li className="text-muted-foreground italic text-xs">
            No important events for {isToday ? "today" : date.toLocaleDateString()}.
          </li>
        )}
      </ul>
      
      {/* Only show the 'AddMultipleTasksModal' as "Add To Do" button */}
      {isSelected && (
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex gap-2">
            <AddMultipleTasksModal 
              onAddTasks={onAddTasks}
              buttonLabel="Add To Do"
              />
          </div>
        </div>
      )}
    </div>
  );
}

