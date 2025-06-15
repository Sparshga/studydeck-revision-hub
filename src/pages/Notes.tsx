
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Notes = () => (
  <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 bg-background">
    <Card className="w-full max-w-lg shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle>All Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">[List of all your notes will appear here]</p>
      </CardContent>
    </Card>
  </main>
);
export default Notes;
