
import React, { useState } from "react";
import StatsDashboard from "@/components/StatsDashboard";
import ProfileCard from "@/components/ProfileCard";
import TodaysTaskList from "@/components/TodaysTaskList";
import ReactiveBackground from "@/components/ReactiveBackground";
import ThemeToggle from "@/components/ThemeToggle";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TodayInfoBox from "@/components/TodayInfoBox";
import DayDetailPopover from "@/components/DayDetailPopover";
import ClassManager from "@/components/ClassManager";
import LabelStatsSection from "@/components/LabelStatsSection";
import AddTaskSection from "@/components/AddTaskSection";
import DashboardStatsCard from "@/components/DashboardStatsCard";

type DayType = "work" | "vacation" | "sickness";

interface DayData {
  dayType: DayType;
  events: string[];
  doneMap: boolean[];
}

type PieStat = { completed: number; left: number };

type TaskItem = { text: string; class?: string };

function getInitialDays() {
  const result: { [key: string]: DayType } = {};
  const now = new Date();
  for (let i = 1; i <= 31; i++) {
    if (i % 6 === 0) result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "vacation";
    else if (i % 13 === 0) result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "sickness";
    else result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "work";
  }
  return result;
}

function getInitialDoneMap(eventsObj: { [key: string]: TaskItem[] }) {
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
      if (doneList[i]) completed++;
      else left++;
    });
  }
  return { completed, left };
}

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [dayData, setDayData] = useState<Record<string, DayData>>({});
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Add state for day types
  const [days, setDays] = useState<{ [key: string]: DayType }>(getInitialDays);
  const [events, setEvents] = useState<{ [key: string]: TaskItem[] }>({});
  const [doneMap, setDoneMap] = useState<{ [key: string]: boolean[] }>(() =>
    getInitialDoneMap({})
  );

  // Class management
  const [classes, setClasses] = useState<string[]>([]);
  const [pendingClass, setPendingClass] = useState<string>("");

  // Sample data for tasks
  const tasks = [
    { text: "Review project proposal", class: "Business" },
    { text: "Update website design", class: "Design" },
    { text: "Call client meeting", class: "Meeting" }
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toDateString();

  const getDayKey = (date: Date) => date.toDateString();

  const getCurrentDayData = (date: Date): DayData => {
    const key = getDayKey(date);
    return dayData[key] || { dayType: "work", events: [], doneMap: [] };
  };

  const updateDayData = (date: Date, updates: Partial<DayData>) => {
    const key = getDayKey(date);
    const current = getCurrentDayData(date);
    setDayData(prev => ({
      ...prev,
      [key]: { ...current, ...updates }
    }));
  };

  const handleDayTypeChange = (date: Date, dayType: DayType) => {
    updateDayData(date, { dayType });
    setDays((prev) => ({
      ...prev,
      [date.toDateString()]: dayType,
    }));
  };

  const handleAddEvent = (date: Date, event: string) => {
    const current = getCurrentDayData(date);
    updateDayData(date, {
      events: [...current.events, event],
      doneMap: [...current.doneMap, false]
    });
    
    const dayStr = date.toDateString();
    setEvents((prev) => {
      const newTask: TaskItem = { text: event };
      if (pendingClass) newTask.class = pendingClass;
      const newEvents = {
        ...prev,
        [dayStr]: [...(prev[dayStr] || []), newTask],
      };
      setDoneMap((dPrev) => ({
        ...dPrev,
        [dayStr]: [...(dPrev[dayStr] || []), false],
      }));
      return newEvents;
    });
    setPendingClass("");
  };

  const handleRemoveEvent = (date: Date, index: number) => {
    const current = getCurrentDayData(date);
    const newEvents = current.events.filter((_, i) => i !== index);
    const newDoneMap = current.doneMap.filter((_, i) => i !== index);
    updateDayData(date, { events: newEvents, doneMap: newDoneMap });
    
    const dayStr = date.toDateString();
    setEvents((prev) => {
      if (!prev[dayStr]) return prev;
      const next = [...prev[dayStr]];
      next.splice(index, 1);
      setDoneMap((dPrev) => {
        const doneList = Array.isArray(dPrev[dayStr]) ? [...dPrev[dayStr]] : [];
        doneList.splice(index, 1);
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
  };

  const handleToggleDone = (date: Date, eventIndex: number) => {
    const current = getCurrentDayData(date);
    const newDoneMap = [...current.doneMap];
    newDoneMap[eventIndex] = !newDoneMap[eventIndex];
    updateDayData(date, { doneMap: newDoneMap });
    
    const dayStr = date.toDateString();
    setDoneMap((prev) => {
      const arr = Array.isArray(prev[dayStr]) ? [...prev[dayStr]] : [];
      arr[eventIndex] = !arr[eventIndex];
      return {
        ...prev,
        [dayStr]: arr,
      };
    });
  };

  const handleAddTasks = (date: Date, tasks: string[]) => {
    tasks.forEach(task => handleAddEvent(date, task));
  };

  const handleCalendarSelect = (d?: Date) => {
    if (!d) return;
    setSelectedDate(d);
    setDisplayMonth(new Date(d.getFullYear(), d.getMonth()));
    const clicked = new Date(d);
    clicked.setHours(0, 0, 0, 0);
    if (clicked >= today) {
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  };

  // Class management handlers
  const handleAddClass = (c: string) =>
    setClasses(prev => prev.includes(c) ? prev : [...prev, c]);
  const handleDeleteClass = (c: string) => setClasses(prev => prev.filter(x => x !== c));

  const handleAddTaskWithLabel = (taskText: string, label?: string) => {
    handleAddEvent(selectedDate, taskText);
  };

  // Calendar modifiers for color coding
  const modifiers = {
    work: Object.keys(days).filter((d) => days[d] === "work").map((d) => new Date(d)),
    vacation: Object.keys(days).filter((d) => days[d] === "vacation").map((d) => new Date(d)),
    sickness: Object.keys(days).filter((d) => days[d] === "sickness").map((d) => new Date(d)),
    today: [today],
  };

  const currentDayData = getCurrentDayData(selectedDate);
  const todayData = getCurrentDayData(new Date());
  const isToday = getDayKey(selectedDate) === getDayKey(new Date());

  // Statistics calculations
  const selectedStats = React.useMemo(() => {
    const str = selectedDate.toDateString();
    const eventsList = events[str] || [];
    const doneList = doneMap[str] || [];
    let completed = 0, left = 0;
    eventsList.forEach((task, i) => {
      if (doneList[i]) completed++;
      else left++;
    });
    return { completed, left };
  }, [selectedDate, events, doneMap]);

  const thisMonthStats = React.useMemo(() => {
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    return getTodoCoverageStats(doneMap, events, { start, end });
  }, [selectedDate, events, doneMap]);

  const thisYearStats = React.useMemo(() => {
    const start = new Date(selectedDate.getFullYear(), 0, 1);
    const end = new Date(selectedDate.getFullYear(), 11, 31);
    return getTodoCoverageStats(doneMap, events, { start, end });
  }, [selectedDate, events, doneMap]);

  const classStats = React.useMemo(() => {
    const result: { [key: string]: { day: PieStat; month: PieStat; year: PieStat } } = {};
    for (const c of classes) {
      const str = selectedDate.toDateString();
      const eventsList = events[str] || [];
      const doneList = doneMap[str] || [];
      let completed = 0, left = 0;
      eventsList.forEach((task, i) => {
        if (task.class !== c) return;
        if (doneList[i]) completed++;
        else left++;
      });
      const dayStat = { completed, left };

      const startM = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endM = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      const monthStat = getTodoCoverageStats(doneMap, events, { start: startM, end: endM }, c);

      const startY = new Date(selectedDate.getFullYear(), 0, 1);
      const endY = new Date(selectedDate.getFullYear(), 11, 31);
      const yearStat = getTodoCoverageStats(doneMap, events, { start: startY, end: endY }, c);
      result[c] = { day: dayStat, month: monthStat, year: yearStat };
    }
    return result;
  }, [classes, selectedDate, events, doneMap]);

  const stats = [
    {
      title: "Today's Tasks",
      stat: selectedStats,
      color: "#2ecc40"
    },
    {
      title: "This Week",
      stat: thisMonthStats,
      color: "#4D96FF"
    },
    {
      title: "This Month",
      stat: thisYearStats,
      color: "#FFD93D"
    }
  ];

  return (
    <main className="relative min-h-screen bg-background dark:bg-gray-900 overflow-hidden">
      <ReactiveBackground bubbleMode={true} />
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile Card */}
          <div className="space-y-6">
            <ProfileCard />
            
            {/* Class Manager Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ClassManager
                  classes={classes}
                  onAddClass={handleAddClass}
                  onDeleteClass={handleDeleteClass}
                />
                <AddTaskSection
                  availableLabels={classes}
                  onAddTask={handleAddTaskWithLabel}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Calendar and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Calendar</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    month={displayMonth}
                    onMonthChange={setDisplayMonth}
                    className="rounded-md border pointer-events-auto"
                    modifiers={modifiers}
                    modifiersClassNames={{
                      work: "bg-yellow-400 text-white rounded-md",
                      vacation: "bg-gray-300 text-gray-800 rounded-md",
                      sickness: "bg-red-300 text-gray-900 rounded-md",
                      today: "ring-2 ring-primary ring-offset-2 font-bold rounded-md",
                    }}
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
                  </div>
                </div>
                
                {selectedDate && (
                  <div className="flex-1">
                    <TodayInfoBox
                      dayType={currentDayData.dayType}
                      events={currentDayData.events}
                      date={selectedDate}
                      doneMap={currentDayData.doneMap}
                      onToggleDone={(eventIdx) => handleToggleDone(selectedDate, eventIdx)}
                      isToday={isToday}
                      isSelected={true}
                      onDayTypeChange={(dayType) => handleDayTypeChange(selectedDate, dayType)}
                      onAddEvent={(event) => handleAddEvent(selectedDate, event)}
                      onRemoveEvent={(index) => handleRemoveEvent(selectedDate, index)}
                      onAddTasks={(tasks) => handleAddTasks(selectedDate, tasks)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Stats Dashboard */}
            <StatsDashboard stats={stats} />
            
            {/* Label Stats Section */}
            <LabelStatsSection classStats={classStats} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
