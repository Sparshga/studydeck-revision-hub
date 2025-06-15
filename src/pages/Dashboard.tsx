
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = () => (
  <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 bg-background">
    <Card className="w-full max-w-lg shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-2">Welcome to your StudyDeck dashboard ✨</p>
        <p className="text-muted-foreground">[Revision activity, stats & heatmap will display here]</p>
      </CardContent>
    </Card>
  </main>
);
export default Dashboard;
