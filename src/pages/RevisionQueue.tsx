
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RevisionQueue = () => (
  <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 bg-background">
    <Card className="w-full max-w-lg shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle>Revision Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">[Smart list of notes due for revision]</p>
      </CardContent>
    </Card>
  </main>
);
export default RevisionQueue;
