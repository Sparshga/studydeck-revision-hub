
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Mail, MapPin, Phone, Pencil } from "lucide-react";

const ProfileCard = () => {
  // Mock profile data; you can connect to real user data if available
  return (
    <Card className="shadow-xl animate-fade-in h-fit px-0 py-0 overflow-hidden relative rounded-2xl">
      {/* Banner + Avatar */}
      <div className="bg-gradient-to-r from-yellow-300/70 via-yellow-200/70 to-yellow-100/80 pt-8 pb-4 px-6">
        <div className="flex flex-col items-center relative">
          {/* Editable Pencil Icon Avatar */}
          <div className="relative group">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white cursor-pointer group-hover:bg-gray-100 transition-colors">
              <Pencil size={40} className="text-yellow-500 group-hover:text-yellow-700" />
            </div>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition text-center whitespace-nowrap bg-white px-2 py-1 rounded shadow border">
              Edit profile image
            </span>
          </div>
          <div className="text-xl font-semibold mt-4">Amélie Laurent</div>
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
            <MapPin className="w-4 h-4 text-yellow-400" />
            <span className="w-28">Adress</span>
            <span className="flex-1 text-right">95700 Roissy-en-France</span>
          </li>
        </ul>
        {/* Removed Documents and Statistics sections */}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
