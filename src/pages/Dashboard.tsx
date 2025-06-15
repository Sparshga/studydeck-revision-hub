import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as React from "react";
import ProfileCard from "@/components/ProfileCard";
import ThemeToggle from "@/components/ThemeToggle";
import DayDetailPopover from "@/components/DayDetailPopover";
import TodayInfoBox from "@/components/TodayInfoBox";
import StatsDashboard from "@/components/StatsDashboard";
import ClassManager from "@/components/ClassManager";
import LabelStatsSection from "@/components/LabelStatsSection";
import { Select } from "@/components/ui/select";
import { useState, useMemo } from "react";
import AddTaskSection from "@/components/AddTaskSection";
import TodaysTaskList from "@/components/TodaysTaskList";
import DashboardStatsCard from "@/components/DashboardStatsCard";

// Modified day types (no truancy!)
type DayType = "work" | "vacation" | "sickness";

// Add PieStat type directly in this file for type support
type PieStat = { completed: number; left: number };

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

type TaskItem = { text: string; class?: string };

function getInitialDoneMap(eventsObj: { [key: string]: TaskItem[] }) {
  // Initialize each day to an empty array matching the number of events for that day
  const done: { [key: string]: boolean[] } = {};
  for (const key in eventsObj) {
    done[key] = eventsObj[key]?.map(() => false);
  }
  return done;
}

function getTodoCoverageStats(
  doneMap: { [key: string]: boolean[] },
  events: { [key: string]: TaskItem[] },
  range: { start: Date; end: Date },
  classFilter?: string
): { completed: number; left: number } {
  let completed = 0, left = 0;
  for (
    let d = new Date(range.start);
    d <= range.end;
    d.setDate(d.getDate() + 1)
  ) {
    const dayStr = new Date(d).toDateString();
    const eventsThisDay = events[dayStr] || [];
    const doneList = doneMap[dayStr] || [];
    eventsThisDay.forEach((task, i) => {
      if (classFilter && task.class !== classFilter) return;
      if (!classFilter && task.class) return; // exclude class-assigned tasks in "all tasks"
      if (doneList[i]) completed++;
      else left++;
    });
  }
  return { completed, left };
}

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date()); // for calendar view
  const [days, setDays] = useState<{ [key: string]: DayType }>(getInitialDays);
  const [events, setEvents] = useState<{ [key: string]: TaskItem[] }>({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  // Add state for task done tracking
  const [doneMap, setDoneMap] = useState<{ [key: string]: boolean[] }>(() =>
    getInitialDoneMap({})
  );

  // The selected date string and info
  const selectedString = selectedDay?.toDateString() ?? "";
  const selectedType: DayType = days[selectedString] || "work";
  const selectedEvents: string[] = (events[selectedString] || []).map(ev => ev.text);

  // Only today's string and data
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toDateString();

  // Handler for calendar click - only allow dates of today or newer
  const handleCalendarSelect = (d?: Date) => {
    if (!d) return;
    setDate(d);
    setDisplayMonth(new Date(d.getFullYear(), d.getMonth()));
    const clicked = new Date(d);
    clicked.setHours(0, 0, 0, 0);
    if (clicked >= today) {
      setSelectedDay(d);
      setDetailOpen(true);
    } else {
      // Don't show popover at all for past dates
      setDetailOpen(false);
      setSelectedDay(d); // still update selection
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

  // Extend onAddEvent for doneMap, now supports class
  const enhancedHandleAddEvent = (event: string, labelOverride?: string) => {
    if (selectedDay) {
      const dayStr = selectedDay.toDateString();
      setEvents((prev) => {
        const newTask: TaskItem = { text: event };
        if (typeof labelOverride === "string") newTask.class = labelOverride;
        else if (pendingClass) newTask.class = pendingClass;
        const newEvents = {
          ...prev,
          [dayStr]: [...(prev[dayStr] || []), newTask],
        };
        // Add new doneMap entry for new event
        setDoneMap((dPrev) => ({
          ...dPrev,
          [dayStr]: [...(dPrev[dayStr] || []), false],
        }));
        return newEvents;
      });
      setPendingClass(""); // reset after add
    }
  };

  // Extend remove event for doneMap
  const enhancedHandleRemoveEvent = (i: number) => {
    if (selectedDay) {
      const dayStr = selectedDay.toDateString();
      setEvents((prev) => {
        if (!prev[dayStr]) return prev;
        const next = [...prev[dayStr]];
        next.splice(i, 1);
        setDoneMap((dPrev) => {
          const doneList = Array.isArray(dPrev[dayStr]) ? [...dPrev[dayStr]] : [];
          doneList.splice(i, 1);
          return {
            ...dPrev,
            [dayStr]: doneList,
          };
        });
        return {
          ...prev,
          [dayStr]: next,
        };
      });
    }
  };

  // Handler for toggling event done status
  const handleToggleDone = (idx: number) => {
    if (selectedDay) {
      const dayStr = selectedDay.toDateString();
      setDoneMap((prev) => {
        const arr = Array.isArray(prev[dayStr]) ? [...prev[dayStr]] : [];
        arr[idx] = !arr[idx];
        return {
          ...prev,
          [dayStr]: arr,
        };
      });
    }
  };

  // Calendar navigation handlers (month/year)
  const handleMonthChange = (inc: number) => {
    setDisplayMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + inc);
      return new Date(newDate.getFullYear(), newDate.getMonth());
    });
  };
  const handleYearChange = (inc: number) => {
    setDisplayMonth(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + inc);
      return new Date(newDate.getFullYear(), newDate.getMonth());
    });
  };

  // The info box will now show selected date info
  const infoBoxDayType: DayType = selectedType;
  const infoBoxEvents: string[] = selectedEvents;
  const infoBoxDate: Date = selectedDay ?? today;
  const infoBoxDoneMap: boolean[] = doneMap[selectedString] || [];
  const isToday = selectedDay
    ? selectedDay.toDateString() === todayString
    : true;

  // Current selected day stats
  const selectedStats = React.useMemo(() => {
    const str = selectedDay ? selectedDay.toDateString() : today.toDateString();
    const eventsList = events[str] || [];
    const doneList = doneMap[str] || [];
    let completed = 0,
      left = 0;
    eventsList.forEach((task, i) => {
      if (task.class) return; // skip tasks with a class
      if (doneList[i]) completed++;
      else left++;
    });
    return { completed, left };
  }, [selectedDay, events, doneMap, today]);

  // This month stats
  const thisMonthStats = React.useMemo(() => {
    const ref = selectedDay ?? today;
    const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
    const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
    return getTodoCoverageStats(doneMap, events, { start, end });
  }, [selectedDay, events, doneMap, today]);

  // This year stats
  const thisYearStats = React.useMemo(() => {
    const ref = selectedDay ?? today;
    const start = new Date(ref.getFullYear(), 0, 1);
    const end = new Date(ref.getFullYear(), 11, 31);
    return getTodoCoverageStats(doneMap, events, { start, end });
  }, [selectedDay, events, doneMap, today]);

  // Modifier arrays for the calendar
  const mockDays = days;
  const modifiers = {
    work: Object.keys(mockDays).filter((d) => mockDays[d] === "work").map((d) => new Date(d)),
    vacation: Object.keys(mockDays).filter((d) => mockDays[d] === "vacation").map((d) => new Date(d)),
    sickness: Object.keys(mockDays).filter((d) => mockDays[d] === "sickness").map((d) => new Date(d)),
    today: [today],
  };

  // Pass if currently selected (side panel correlates with selectedDay)
  const isSelected = true;

  // class add/remove
  const [classes, setClasses] = useState<string[]>([]);
  const handleAddClass = (c: string) =>
    setClasses(prev => prev.includes(c) ? prev : [...prev, c]);
  const handleDeleteClass = (c: string) => setClasses(prev => prev.filter(x => x !== c));

  // Extract class list for dropdown
  const classOptions = classes;

  // --- When adding a task, select a class (optional) ---
  const [pendingClass, setPendingClass] = useState<string>("");

  // For per-class stats
  const classStats = React.useMemo(() => {
    const result: { [key: string]: { day: PieStat; month: PieStat; year: PieStat } } = {};
    for (const c of classes) {
      // 1. Selected date
      const str = selectedDay ? selectedDay.toDateString() : today.toDateString();
      const eventsList = events[str] || [];
      const doneList = doneMap[str] || [];
      let completed = 0,
        left = 0;
      eventsList.forEach((task, i) => {
        if (task.class !== c) return;
        if (doneList[i]) completed++;
        else left++;
      });
      const dayStat = { completed, left };

      // This month
      const ref = selectedDay ?? today;
      const startM = new Date(ref.getFullYear(), ref.getMonth(), 1);
      const endM = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
      const monthStat = getTodoCoverageStats(doneMap, events, { start: startM, end: endM }, c);

      // This year
      const startY = new Date(ref.getFullYear(), 0, 1);
      const endY = new Date(ref.getFullYear(), 11, 31);
      const yearStat = getTodoCoverageStats(doneMap, events, { start: startY, end: endY }, c);
      result[c] = { day: dayStat, month: monthStat, year: yearStat };
    }
    return result;
  }, [classes, selectedDay, events, doneMap, today]);

  // Handle AddTaskSection "add task" logic unified for both labeled and non-labeled tasks:
  const handleAddTaskWithLabel = (taskText: string, label?: string) => {
    enhancedHandleAddEvent(taskText, label);
  };

  return (
    // Outer container: horizontal flex on md+, stack on mobile
    <main className="min-h-[90vh] w-full flex flex-col md:flex-row items-start justify-start gap-6 bg-white p-2 sm:p-8">

      {/* Left: All Dashboard Main Content (vertically stacked) */}
      <div className="w-full md:w-2/3 flex flex-col gap-8">
        {/* Theme toggle at TOP LEFT */}
        <div className="mb-4 flex justify-start">
          <ThemeToggle />
        </div>
        {/* DASHBOARD section */}
        <div className="w-full shadow-md animate-fade-in p-0 flex flex-col min-h-[520px] mb-4">
          <CardHeader className="pb-2 pt-6 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Dashboard</CardTitle>
            <div className="flex gap-2 items-center">
              {/* Month/year navigation */}
              <button
                className="p-1 rounded hover:bg-muted"
                onClick={() => handleYearChange(-1)}
                aria-label="Prev year"
              >{"<<"}</button>
              <button
                className="p-1 rounded hover:bg-muted"
                onClick={() => handleMonthChange(-1)}
                aria-label="Prev month"
              >{"<"}</button>
              <span className="text-sm text-foreground min-w-[120px] text-center">
                {displayMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
              </span>
              <button
                className="p-1 rounded hover:bg-muted"
                onClick={() => handleMonthChange(1)}
                aria-label="Next month"
              >{">"}</button>
              <button
                className="p-1 rounded hover:bg-muted"
                onClick={() => handleYearChange(1)}
                aria-label="Next year"
              >{">>"}</button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-0 pb-6 px-6">
            <div className="text-muted-foreground mb-2 text-sm">
              Overview of your work schedule this month
            </div>
            <div className="mb-4">
              <ClassManager
                classes={classes}
                onAddClass={handleAddClass}
                onDeleteClass={handleDeleteClass}
              />
            </div>
            <div className="border rounded-lg p-2 bg-white shadow-sm overflow-x-auto pointer-events-auto flex flex-col sm:flex-row gap-4">
              {/* CALENDAR */}
              <DayDetailPopover
                open={detailOpen && (selectedDay ? selectedDay >= today : false)}
                onOpenChange={setDetailOpen}
                anchor={
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDay || date}
                      onSelect={handleCalendarSelect}
                      month={displayMonth}
                      onMonthChange={setDisplayMonth}
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
                        head_cell: "text-muted-foreground w-9 font-normal text-[0.8rem]",
                        cell: "h-9 w-9 text-center text-sm p-0 relative rounded-md focus-within:relative focus-within:z-20",
                        day:
                          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
                        day_range_end: "day-range-end",
                        day_selected:
                          "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white rounded-md",
                        day_today: "ring-2 ring-primary ring-offset-2 font-bold rounded-md",
                        day_outside:
                          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_range_middle:
                          "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                      }}
                      modifiers={modifiers}
                      modifiersClassNames={{
                        work: "bg-yellow-400 text-white rounded-md",
                        vacation: "bg-gray-300 text-gray-800 rounded-md",
                        sickness: "bg-red-300 text-gray-900 rounded-md",
                        today: "ring-2 ring-primary ring-offset-2 font-bold rounded-md",
                      }}
                      fromDate={new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1)}
                      toDate={new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0)}
                      showOutsideDays={false}
                      disabled={() => false}
                    />
                    {/* Legend */}
                    <div className="flex gap-4 mt-4 px-2 text-xs items-center">
                      <span className="flex gap-1 items-center">
                        <span className="w-3 h-3 bg-yellow-400 inline-block rounded-md"></span>Work
                      </span>
                      <span className="flex gap-1 items-center">
                        <span className="w-3 h-3 bg-gray-300 inline-block rounded-md"></span>Vacation
                      </span>
                      <span className="flex gap-1 items-center">
                        <span className="w-3 h-3 bg-red-300 inline-block rounded-md"></span>Sickness
                      </span>
                      <span className="ml-auto text-[0.9em] text-muted-foreground">Today</span>
                    </div>
                  </div>
                }
                date={selectedDay || today}
                dayType={selectedType}
                onDayTypeChange={handleDayTypeChange}
                events={selectedEvents}
                onAddEvent={() => {}}
                onRemoveEvent={enhancedHandleRemoveEvent}
              >
                {/* No children */}
              </DayDetailPopover>
              {/* Now shows info for selected day, and passes new handlers */}
              <div className="min-w-[320px] flex flex-col gap-2">
                <TodayInfoBox
                  dayType={infoBoxDayType}
                  events={selectedEvents}
                  date={infoBoxDate}
                  doneMap={infoBoxDoneMap}
                  onToggleDone={handleToggleDone}
                  isToday={isToday}
                  isSelected={true}
                  onDayTypeChange={handleDayTypeChange}
                  onAddEvent={(taskStr: string) => {
                    handleAddTaskWithLabel(taskStr, pendingClass || undefined);
                  }}
                  onRemoveEvent={enhancedHandleRemoveEvent}
                  onAddTasks={(tasks: string[]) => {
                    tasks.forEach(task =>
                      handleAddTaskWithLabel(task, pendingClass || undefined)
                    );
                  }}
                />
                <AddTaskSection
                  availableLabels={classes}
                  onAddTask={handleAddTaskWithLabel}
                />
                <TodaysTaskList tasks={events[todayString] || []} />
              </div>
            </div>
          </CardContent>
        </div>
        {/* STATISTICS DASHBOARD */}
        <DashboardStatsCard
          stats={[
            {
              title: selectedDay
                ? `Selected (${selectedDay.toLocaleDateString()})`
                : `Today (${today.toLocaleDateString()})`,
              stat: selectedStats, // This includes ALL tasks for selected day, with or without label
              color: "#2ecc40",
            },
            {
              title: `Month (${(selectedDay ?? today).toLocaleString(undefined, {
                month: "long",
                year: "numeric",
              })})`,
              stat: thisMonthStats,
              color: "#ffd600",
            },
            {
              title: `Year (${(selectedDay ?? today).getFullYear()})`,
              stat: thisYearStats,
              color: "#ffd600",
            },
          ]}
        />
        <LabelStatsSection classStats={classStats} />
      </div>

      {/* Right: Profile Card as sidebar */}
      <div className="w-full md:w-1/3 max-w-md md:sticky md:top-8 self-start">
        <ProfileCard />
      </div>

    </main>
  );
};

export default Dashboard;
