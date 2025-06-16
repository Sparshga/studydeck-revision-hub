
import StatsDashboard from "@/components/StatsDashboard";
import ProfileCard from "@/components/ProfileCard";
import TodaysTaskList from "@/components/TodaysTaskList";
import ReactiveBackground from "@/components/ReactiveBackground";
import ThemeToggle from "@/components/ThemeToggle";

const Dashboard = () => {
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

  return (
    <main className="relative min-h-screen bg-background dark:bg-gray-900 overflow-hidden">
      <ReactiveBackground bubbleMode={true} />
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile and Today's Tasks */}
          <div className="space-y-6">
            <ProfileCard />
            <TodaysTaskList tasks={tasks} />
          </div>
          
          {/* Right column - Stats Dashboard */}
          <div className="lg:col-span-2">
            <StatsDashboard stats={stats} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
