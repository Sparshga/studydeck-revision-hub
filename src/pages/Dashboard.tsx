
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import ReactiveBackground from "@/components/ReactiveBackground";
import DashboardStatsCard from "@/components/DashboardStatsCard";
import LabelStatsSection from "@/components/LabelStatsSection";

// Sample data for demonstration purposes
const sampleStats = [
  { title: "Today", stat: { completed: 8, left: 4 }, color: "#2ecc40" },
  { title: "This Month", stat: { completed: 60, left: 22 }, color: "#ffd600" },
  { title: "This Year", stat: { completed: 223, left: 45 }, color: "#7d5fff" },
];

// Sample label-based stats
const sampleLabelStats = {
  Work: {
    day: { completed: 3, left: 2 },
    month: { completed: 25, left: 8 },
    year: { completed: 98, left: 12 },
  },
  Personal: {
    day: { completed: 2, left: 1 },
    month: { completed: 18, left: 3 },
    year: { completed: 70, left: 10 },
  },
  Gym: {
    day: { completed: 1, left: 1 },
    month: { completed: 12, left: 2 },
    year: { completed: 55, left: 8 },
  },
};

const Dashboard = () => {
  const [bubbleMode, setBubbleMode] = React.useState(false);

  return (
    <>
      <ReactiveBackground bubbleMode={bubbleMode} />
      <main className="flex min-h-[80vh] flex-col items-center justify-start p-8 bg-background w-full">
        <Card className="w-full max-w-lg shadow-md animate-fade-in mb-8">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-medium">Bubble Mode</span>
              <Switch
                checked={bubbleMode}
                onCheckedChange={setBubbleMode}
                aria-label="Toggle Bubble Mode"
              />
            </div>
            <p className="text-muted-foreground mb-4">Welcome to your dashboard! Use Bubble Mode for fun visual effects, and review your progress below.</p>
          </CardContent>
        </Card>

        {/* Dashboard Stats */}
        <div className="w-full max-w-4xl">
          <DashboardStatsCard stats={sampleStats} />

          {/* Label/Tag Stats */}
          <LabelStatsSection classStats={sampleLabelStats} />
        </div>
      </main>
    </>
  );
};

export default Dashboard;

