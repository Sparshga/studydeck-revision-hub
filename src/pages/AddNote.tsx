
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AddNote = () => (
  <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 bg-background">
    <Card className="w-full max-w-lg shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle>Add / Edit Note</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">[Form for creating or editing notes]</p>
      </CardContent>
    </Card>
  </main>
);
export default AddNote;
