import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Calendar as CalendarIcon, MapPin, Phone } from "lucide-react";
import * as React from "react";
import ProfileCard from "@/components/ProfileCard";

function getMockDays() {
  // For simplicity, yellow for 'work', gray for 'vacation', black for 'truancy'
  const result: { [key: string]: "work" | "vacation" | "truancy" | "sickness" } = {};
  const now = new Date();
  for (let i = 1; i <= 31; i++) {
    if (i % 6 === 0) result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "vacation";
    else if (i % 8 === 0) result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "truancy";
    else if (i % 13 === 0) result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "sickness";
    else result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "work";
  }
  return result;
}

// Helper to render the colored dots or background in the calendar
const dayStyles = {
  work: "bg-yellow-400 text-white font-bold",
  vacation: "bg-gray-300 text-gray-700 font-medium",
  truancy: "bg-black text-white",
  sickness: "bg-pink-200 text-gray-800 font-medium"
}

import ThemeToggle from "@/components/ThemeToggle";
import DayDetailPopover from "@/components/DayDetailPopover";
import TodayInfoBox from "@/components/TodayInfoBox";
import { useState, useMemo } from "react";

// Modified day types (no truancy!)
type DayType = "work" | "vacation" | "sickness";

function getInitialDays() {
  // Similar mockDays logic, simply use without truancy
  const result: { [key: string]: DayType } = {};
  const now = new Date();
  for (let i = 1; i <= 31; i++) {
    if (i % 6 === 0) result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "vacation";
    else if (i % 13 === 0) result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "sickness";
    else result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "work";
  }
  return result;
}

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [days, setDays] = useState<{ [key: string]: DayType }>(getInitialDays);
  const [events, setEvents] = useState<{ [key: string]: string[] }>({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // For today info
  const todayString = new Date().toDateString();
  const todayType: DayType = days[todayString] || "work";
  const todayEvents: string[] = events[todayString] || [];

  // Handler for calendar click
  const handleCalendarSelect = (d?: Date) => {
    setDate(d);
    if (d) {
      setSelectedDay(d);
      setDetailOpen(true);
    }
  };

  const handleDayTypeChange = (t: DayType) => {
    if (selectedDay) {
      setDays((prev) => ({
        ...prev,
        [selectedDay.toDateString()]: t,
      }));
    }
  };

  const handleAddEvent = (event: string) => {
    if (selectedDay) {
      setEvents((prev) => {
        const dayStr = selectedDay.toDateString();
        return {
          ...prev,
          [dayStr]: [...(prev[dayStr] || []), event],
        }
      });
    }
  };

  const handleRemoveEvent = (i: number) => {
    if (selectedDay) {
      setEvents((prev) => {
        const dayStr = selectedDay.toDateString();
        if (!prev[dayStr]) return prev;
        const next = [...prev[dayStr]];
        next.splice(i, 1);
        return {
          ...prev,
          [dayStr]: next,
        }
      });
    }
  };

  // Get data for selected
  const selectedString = selectedDay?.toDateString() ?? "";
  const selectedType: DayType = days[selectedString] || "work";
  const selectedEvents: string[] = events[selectedString] || [];

  // Modifier arrays for the calendar
  const mockDays = days;
  const modifiers = {
    work: Object.keys(mockDays).filter((d) => mockDays[d] === "work").map((d) => new Date(d)),
    vacation: Object.keys(mockDays).filter((d) => mockDays[d] === "vacation").map((d) => new Date(d)),
    sickness: Object.keys(mockDays).filter((d) => mockDays[d] === "sickness").map((d) => new Date(d)),
    today: [new Date()]
  };

  return (
    <main className="min-h-[90vh] w-full flex flex-col lg:flex-row items-stretch justify-center gap-8 bg-gradient-to-br from-[#f7f7fb] via-[#fefefe] to-[#fefefe] p-2 sm:p-8">
      {/* Main content (calendar) */}
      <div className="flex-1 flex min-w-0 flex-col items-center gap-6">
        <div className="self-end">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-2xl shadow-md animate-fade-in p-0 flex flex-col min-h-[520px]">
          <CardHeader className="pb-2 pt-6 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Dashboard</CardTitle>
            <div className="flex gap-2 items-center">
              {/* Show month/year */}
              <span className="text-sm text-foreground">{date ? date.toLocaleString(undefined, { month: "long", year: "numeric" }) : ""}</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-0 pb-6 px-6">
            <div className="text-muted-foreground mb-2 text-sm">
              Overview of your work schedule this month
            </div>
            <div className="border rounded-lg p-2 bg-white shadow-sm overflow-x-auto pointer-events-auto flex flex-col sm:flex-row gap-4">
              {/* CALENDAR */}
              <DayDetailPopover
                open={detailOpen}
                onOpenChange={setDetailOpen}
                anchor={
                <div>
                  <Calendar
                    mode="single"
                    selected={date}
                    // When a day is clicked: open details popover
                    onSelect={handleCalendarSelect}
                    className="pointer-events-auto"
                    modifiers={modifiers}
                    modifiersClassNames={{
                      work: "bg-yellow-400 text-white rounded-full",
                      vacation: "bg-gray-300 text-gray-800 rounded-full",
                      sickness: "bg-red-300 text-gray-900 rounded-full",
                      today: "ring-2 ring-primary ring-offset-2 font-bold"
                    }}
                    fromDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                    toDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                    showOutsideDays={false}
                  />
                  <div className="flex gap-4 mt-4 px-2 text-xs items-center">
                    <span className="flex gap-1 items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>Work</span>
                    <span className="flex gap-1 items-center"><span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>Vacation</span>
                    <span className="flex gap-1 items-center"><span className="w-3 h-3 rounded-full bg-red-300 inline-block"></span>Sickness</span>
                    <span className="ml-auto text-[0.9em] text-muted-foreground">Today</span>
                  </div>
                </div>
                }
                date={selectedDay || new Date()}
                dayType={selectedType}
                onDayTypeChange={handleDayTypeChange}
                events={selectedEvents}
                onAddEvent={handleAddEvent}
                onRemoveEvent={handleRemoveEvent}
              />
              {/* TODAY'S INFO BOX */}
              <div className="min-w-[280px]">
                <TodayInfoBox dayType={todayType} events={todayEvents} date={new Date()} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Right side profile card */}
      <aside className="w-full lg:max-w-sm flex justify-center">
        <ProfileCard />
      </aside>
    </main>
  );
};

export default Dashboard;
