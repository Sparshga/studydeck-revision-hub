
import React from "react";

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
}

export default function TodayInfoBox({ dayType, events, date }: TodayInfoBoxProps) {
  return (
    <div className="bg-card shadow rounded-lg p-4 flex flex-col min-w-[260px] gap-2">
      <div className="flex items-center mb-1">
        <div className={`px-2 py-1 rounded text-xs font-semibold capitalize ${colorMap[dayType]}`}>
          {dayType}
        </div>
        <div className="ml-auto font-medium text-xs text-muted-foreground">{date.toLocaleDateString()}</div>
      </div>
      <div className="text-xs text-muted-foreground mb-1">Events for today:</div>
      <ul className="space-y-1">
        {events.length ? (
          events.map((e, i) => (
            <li key={i} className="text-sm bg-muted rounded px-2 py-1">{e}</li>
          ))
        ) : (
          <li className="text-muted-foreground italic text-xs">No important events for today.</li>
        )}
      </ul>
    </div>
  );
}
