
import StatsDashboard from "@/components/StatsDashboard";
import ProfileCard from "@/components/ProfileCard";
import TodaysTaskList from "@/components/TodaysTaskList";
import ReactiveBackground from "@/components/ReactiveBackground";
import ThemeToggle from "@/components/ThemeToggle";

const Dashboard = () => (
  <main className="relative min-h-screen bg-background dark:bg-gray-900 overflow-hidden">
    <ReactiveBackground />
    
    {/* Theme Toggle */}
    <div className="absolute top-4 right-4 z-20">
      <ThemeToggle />
    </div>
    
    <div className="relative z-10 container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Profile and Today's Tasks */}
        <div className="space-y-6">
          <ProfileCard />
          <TodaysTaskList />
        </div>
        
        {/* Right column - Stats Dashboard */}
        <div className="lg:col-span-2">
          <StatsDashboard />
        </div>
      </div>
    </div>
  </main>
);

export default Dashboard;
