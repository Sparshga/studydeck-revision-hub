
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import ReactiveBackground from "@/components/ReactiveBackground";

const Dashboard = () => {
  const [bubbleMode, setBubbleMode] = React.useState(false);

  return (
    <>
      <ReactiveBackground bubbleMode={bubbleMode} />
      <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-lg shadow-md animate-fade-in">
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
            <p className="text-muted-foreground">[Your dashboard content here]</p>
            {/* Add back anything else you had in your dashboard below this line */}
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Dashboard;
