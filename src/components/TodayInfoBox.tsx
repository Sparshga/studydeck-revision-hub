
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

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
}

export default function TodayInfoBox({
  dayType,
  events,
  date,
  doneMap,
  onToggleDone,
  isToday,
}: TodayInfoBoxProps) {
  return (
    <div className="bg-card shadow rounded-lg p-4 flex flex-col min-w-[260px] gap-2">
      <div className="flex items-center mb-1">
        <div className={`px-2 py-1 rounded text-xs font-semibold capitalize ${colorMap[dayType]}`}>
          {dayType}
        </div>
        <div className="ml-auto font-medium text-xs text-muted-foreground">{date.toLocaleDateString()}</div>
      </div>
      <div className="text-xs text-muted-foreground mb-1">
        {isToday ? "Events for today:" : `Events for ${date.toLocaleDateString()}:`}
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
            </li>
          ))
        ) : (
          <li className="text-muted-foreground italic text-xs">
            No important events for {isToday ? "today" : date.toLocaleDateString()}.
          </li>
        )}
      </ul>
    </div>
  );
}

