
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Calendar as CalendarIcon, MapPin, Phone } from "lucide-react";
import * as React from "react";
import ProfileCard from "@/components/ProfileCard";

function getMockDays() {
  // For simplicity, yellow for 'work', gray for 'vacation', black for 'truancy'
  const result: { [key: string]: "work" | "vacation" | "truancy" | "sickness" } = {};
  const now = new Date();
  for (let i = 1; i <= 31; i++) {
    if (i % 6 === 0) result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "vacation";
    else if (i % 8 === 0) result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "truancy";
    else if (i % 13 === 0) result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "sickness";
    else result[new Date(now.getFullYear(), now.getMonth(), i).toDateString()] = "work";
  }
  return result;
}

// Helper to render the colored dots or background in the calendar
const dayStyles = {
  work: "bg-yellow-400 text-white font-bold",
  vacation: "bg-gray-300 text-gray-700 font-medium",
  truancy: "bg-black text-white",
  sickness: "bg-pink-200 text-gray-800 font-medium"
}

const Dashboard = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const mockDays = React.useMemo(() => getMockDays(), []);

  return (
    <main className="min-h-[90vh] w-full flex flex-col lg:flex-row items-stretch justify-center gap-8 bg-gradient-to-br from-[#f7f7fb] via-[#fefefe] to-[#fefefe] p-2 sm:p-8">
      {/* Main content (calendar) */}
      <div className="flex-1 flex items-start justify-center">
        <Card className="w-full max-w-2xl shadow-md animate-fade-in p-0 flex flex-col min-h-[520px]">
          <CardHeader className="pb-2 pt-6 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Dashboard</CardTitle>
            <div className="flex gap-2 items-center">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">{date ? date.toLocaleString(undefined, { month: "long", year: "numeric" }) : ""}</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-0 pb-6 px-6">
            <div className="text-muted-foreground mb-2 text-sm">
              Overview of your work schedule this month
            </div>
            <div className="border rounded-lg p-2 bg-white shadow-sm overflow-x-auto pointer-events-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="pointer-events-auto"
                modifiers={{
                  work: Object.keys(mockDays)
                    .filter((d) => mockDays[d] === "work")
                    .map((d) => new Date(d)),
                  vacation: Object.keys(mockDays)
                    .filter((d) => mockDays[d] === "vacation")
                    .map((d) => new Date(d)),
                  truancy: Object.keys(mockDays)
                    .filter((d) => mockDays[d] === "truancy")
                    .map((d) => new Date(d)),
                  sickness: Object.keys(mockDays)
                    .filter((d) => mockDays[d] === "sickness")
                    .map((d) => new Date(d)),
                  today: [new Date()]
                }}
                modifiersClassNames={{
                  work: "bg-yellow-400 text-white rounded-full",
                  vacation: "bg-gray-300 text-gray-800 rounded-full",
                  truancy: "bg-black text-white rounded-full",
                  sickness: "bg-red-300 text-gray-900 rounded-full",
                  today: "ring-2 ring-primary ring-offset-2 font-bold"
                }}
                fromDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                toDate={new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)}
                showOutsideDays={false}
              />
              <div className="flex gap-4 mt-4 px-2 text-xs items-center">
                <span className="flex gap-1 items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>Work</span>
                <span className="flex gap-1 items-center"><span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>Vacation</span>
                <span className="flex gap-1 items-center"><span className="w-3 h-3 rounded-full bg-black inline-block"></span>Truancy</span>
                <span className="flex gap-1 items-center"><span className="w-3 h-3 rounded-full bg-red-300 inline-block"></span>Sickness</span>
                <span className="ml-auto text-[0.9em] text-muted-foreground">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Right side profile card */}
      <aside className="w-full lg:max-w-sm flex justify-center">
        <ProfileCard />
      </aside>
    </main>
  );
};

export default Dashboard;

