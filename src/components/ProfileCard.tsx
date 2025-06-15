
import React, { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Mail, MapPin, Phone, Pencil, Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ProfileCard = () => {
  // Image upload
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Mock statistics (replace with real data if available)
  const totalNotes = 36; // Placeholder, replace with real stats
  const notesInQueue = 8; // Placeholder
  const tasksToday = 5;   // Placeholder

  // Handle image change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImg(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="shadow-xl animate-fade-in h-fit px-0 py-0 overflow-hidden relative rounded-2xl">
      {/* Banner + Avatar */}
      <div className="bg-gradient-to-r from-yellow-300/70 via-yellow-200/70 to-yellow-100/80 pt-8 pb-4 px-6">
        <div className="flex flex-col items-center relative">
          {/* Uploadable Avatar */}
          <div className="relative group">
            <button
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white cursor-pointer group-hover:bg-gray-100 transition-colors focus:outline-none"
              title="Upload profile image"
              onClick={() => fileRef.current?.click()}
              aria-label="Edit profile image"
              type="button"
            >
              {profileImg ? (
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profileImg} alt="Profile" />
                  <AvatarFallback>
                    <Pencil size={40} className="text-yellow-500" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Pencil size={40} className="text-yellow-500 group-hover:text-yellow-700" />
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileRef}
                onChange={onFileChange}
                aria-label="Choose profile image"
              />
            </button>
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
        {/* Statistics Section */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-muted-foreground mb-2 mt-3">Statistics</div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center justify-between">
              <span>Total notes added</span>
              <span className="font-bold text-yellow-600">{totalNotes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Notes in queue</span>
              <span className="font-bold text-yellow-600">{notesInQueue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tasks for today</span>
              <span className="font-bold text-yellow-600">{tasksToday}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
