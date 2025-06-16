
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

type DayType = "work" | "vacation" | "sickness";

interface DayData {
  dayType: DayType;
  events: string[];
  doneMap: boolean[];
}

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dayData, setDayData] = useState<Record<string, DayData>>({});
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Sample data for tasks
  const tasks = [
    { text: "Review project proposal", class: "Business" },
    { text: "Update website design", class: "Design" },
    { text: "Call client meeting", class: "Meeting" }
  ];

  // Sample data for stats
  const stats = [
    {
      title: "Today's Tasks",
      stat: { completed: 3, left: 2 },
      color: "#2ecc40"
    },
    {
      title: "This Week",
      stat: { completed: 12, left: 8 },
      color: "#4D96FF"
    },
    {
      title: "This Month",
      stat: { completed: 45, left: 15 },
      color: "#FFD93D"
    }
  ];

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
  };

  const handleAddEvent = (date: Date, event: string) => {
    const current = getCurrentDayData(date);
    updateDayData(date, {
      events: [...current.events, event],
      doneMap: [...current.doneMap, false]
    });
  };

  const handleRemoveEvent = (date: Date, index: number) => {
    const current = getCurrentDayData(date);
    const newEvents = current.events.filter((_, i) => i !== index);
    const newDoneMap = current.doneMap.filter((_, i) => i !== index);
    updateDayData(date, { events: newEvents, doneMap: newDoneMap });
  };

  const handleToggleDone = (date: Date, eventIndex: number) => {
    const current = getCurrentDayData(date);
    const newDoneMap = [...current.doneMap];
    newDoneMap[eventIndex] = !newDoneMap[eventIndex];
    updateDayData(date, { doneMap: newDoneMap });
  };

  const handleAddTasks = (date: Date, tasks: string[]) => {
    tasks.forEach(task => handleAddEvent(date, task));
  };

  const currentDayData = getCurrentDayData(selectedDate);
  const todayData = getCurrentDayData(new Date());
  const isToday = getDayKey(selectedDate) === getDayKey(new Date());

  return (
    <main className="relative min-h-screen bg-background dark:bg-gray-900 overflow-hidden">
      <ReactiveBackground bubbleMode={true} />
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile Card and Today's Tasks */}
          <div className="space-y-6">
            <ProfileCard />
            <TodaysTaskList tasks={tasks} />
            
            {/* Today's Info Box */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <TodayInfoBox
                  dayType={todayData.dayType}
                  events={todayData.events}
                  date={new Date()}
                  doneMap={todayData.doneMap}
                  onToggleDone={(eventIdx) => handleToggleDone(new Date(), eventIdx)}
                  isToday={true}
                  isSelected={true}
                  onDayTypeChange={(dayType) => handleDayTypeChange(new Date(), dayType)}
                  onAddEvent={(event) => handleAddEvent(new Date(), event)}
                  onRemoveEvent={(index) => handleRemoveEvent(new Date(), index)}
                  onAddTasks={(tasks) => handleAddTasks(new Date(), tasks)}
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
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
