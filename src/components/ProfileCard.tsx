
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Mail, MapPin, Phone, FileText, FileBadge2 } from "lucide-react";

const ProfileCard = () => {
  // Mock profile data; you can connect to real user data if available
  return (
    <Card className="shadow-xl animate-fade-in h-fit px-0 py-0 overflow-hidden relative rounded-2xl">
      {/* Banner + Avatar */}
      <div className="bg-gradient-to-r from-yellow-300/70 via-yellow-200/70 to-yellow-100/80 pt-8 pb-4 px-6">
        <div className="flex flex-col items-center">
          <img
            src="/lovable-uploads/7ccb9b27-96d9-4e41-a0f2-c7e3e5e45fa9.png"
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg mb-2"
          />
          <div className="text-xl font-semibold">Amélie Laurent</div>
          <div className="text-sm text-muted-foreground mb-1">UX Designer</div>
        </div>
      </div>
      <CardContent className="px-6 pt-2 pb-6">
        <div className="text-xs font-semibold text-muted-foreground mb-1 mt-2">Basic Information</div>
        <ul className="text-sm space-y-1 mb-4">
          <li className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-yellow-400" />
            <span className="w-28">Birthday</span>
            <span className="flex-1 text-right">26 September 1998</span>
          </li>
          <li className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-yellow-400" />
            <span className="w-28">Phone number</span>
            <span className="flex-1 text-right">+33 1 70 36 39 50</span>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-yellow-400" />
            <span className="w-28">E-Mail</span>
            <span className="flex-1 text-right truncate">amelielaurent88@gmail.com</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-yellow-400" />
            <span className="w-28">City</span>
            <span className="flex-1 text-right">Paris</span>
          </li>
          <li className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-yellow-400" />
            <span className="w-28">Citizenship</span>
            <span className="flex-1 text-right">France</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-yellow-400" />
            <span className="w-28">Adress</span>
            <span className="flex-1 text-right">95700 Roissy-en-France</span>
          </li>
        </ul>
        <div className="font-semibold text-xs text-muted-foreground mb-1">Documents</div>
        <div className="flex gap-2 mb-3">
          <button className="flex gap-2 items-center bg-blue-100 text-blue-900 rounded px-2.5 py-1 text-xs font-bold shadow hover:bg-blue-200 transition">
            <FileBadge2 className="w-4 h-4" /> Contract
            <span className="ml-1 font-normal text-[0.82em]">(23 mb)</span>
          </button>
          <button className="flex gap-2 items-center bg-orange-100 text-orange-900 rounded px-2.5 py-1 text-xs font-bold shadow hover:bg-orange-200 transition">
            <FileBadge2 className="w-4 h-4" /> Resume
            <span className="ml-1 font-normal text-[0.82em]">(26 mb)</span>
          </button>
        </div>
        <div className="font-semibold text-xs text-muted-foreground mb-1">Statistics</div>
        <div className="mb-2 flex gap-2 items-center">
          <span className="w-28 text-xs">Business trips</span>
          <div className="flex-1 bg-yellow-200 h-2 rounded mr-2 relative overflow-hidden">
            <div className="bg-yellow-400 h-2 rounded absolute left-0 top-0" style={{ width: "68%" }} />
          </div>
          <span className="text-xs text-muted-foreground">58 days</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-28 text-xs">Sickness</span>
          <div className="flex-1 bg-red-200 h-2 rounded mr-2 relative overflow-hidden">
            <div className="bg-red-400 h-2 rounded absolute left-0 top-0" style={{ width: "28%" }} />
          </div>
          <span className="text-xs text-muted-foreground">24 days</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
