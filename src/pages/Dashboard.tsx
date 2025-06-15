import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as React from "react";
import ProfileCard from "@/components/ProfileCard";
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

  // Handler for calendar click - only allow dates of today or newer
  const handleCalendarSelect = (d?: Date) => {
    setDate(d);
    if (d) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const clicked = new Date(d);
      clicked.setHours(0, 0, 0, 0);
      if (clicked >= today) {
        setSelectedDay(d);
        setDetailOpen(true);
      } else {
        // Don't show popover at all for past dates
        setDetailOpen(false);
        setSelectedDay(null);
      }
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
                      onSelect={handleCalendarSelect}
                      className="pointer-events-auto"
                      classNames={{
                        row: "flex w-full mt-2 space-x-1",
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell:
                          "text-muted-foreground w-9 font-normal text-[0.8rem]",
                        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                        day_range_end: "day-range-end",
                        day_selected:
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
                        day_outside:
                          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_range_middle:
                          "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                      }}
                      modifiers={modifiers}
                      modifiersClassNames={{
                        work: "bg-yellow-400 text-white",
                        vacation: "bg-gray-300 text-gray-800",
                        sickness: "bg-red-300 text-gray-900",
                        today: "ring-2 ring-primary ring-offset-2 font-bold"
                      }}
                      fromDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                      toDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
                      showOutsideDays={false}
                      disabled={() => false}
                    />
                    <div className="flex gap-4 mt-4 px-2 text-xs items-center">
                      <span className="flex gap-1 items-center"><span className="w-3 h-3 bg-yellow-400 inline-block"></span>Work</span>
                      <span className="flex gap-1 items-center"><span className="w-3 h-3 bg-gray-300 inline-block"></span>Vacation</span>
                      <span className="flex gap-1 items-center"><span className="w-3 h-3 bg-red-300 inline-block"></span>Sickness</span>
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
