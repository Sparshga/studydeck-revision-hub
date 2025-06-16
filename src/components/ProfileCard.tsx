import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Mail, MapPin, Phone, Pencil } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProfileCard = () => {
  // Editable fields state
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Individual attributes
  const [name, setName] = useState("Amélie Laurent");
  const [role, setRole] = useState("UX Designer");
  const [birthday, setBirthday] = useState("1998-09-26"); // store as yyyy-mm-dd for input type="date"
  const [phone, setPhone] = useState("+33 1 70 36 39 50");
  const [city, setCity] = useState("Paris");
  const [address, setAddress] = useState("95700 Roissy-en-France");
  // email isn't editable
  const email = "amelielaurent88@gmail.com";

  const fileRef = useRef<HTMLInputElement>(null);

  // Mock statistics
  const totalNotes = 36;
  const notesInQueue = 8;
  const tasksToday = 5;

  // Handle image upload
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

  // Save changes
  const handleSave = () => {
    setEditMode(false);
  };

  return (
    <Card className="shadow-xl animate-fade-in h-fit px-0 py-0 overflow-hidden relative rounded-2xl">
      {/* Edit Icon - Now Golden */}
      <button
        className="absolute top-3 right-3 z-10 bg-yellow-400/90 backdrop-blur-sm hover:bg-yellow-500 transition-colors rounded-full p-1.5 shadow focus:outline-none"
        aria-label="Edit profile"
        type="button"
        onClick={() => setEditMode((m) => !m)}
      >
        <Pencil size={18} className="text-yellow-900" />
      </button>
      
      {/* Banner + Avatar with Custom Background */}
      <div 
        className="pt-8 pb-4 px-6 relative"
        style={{
          backgroundImage: `url('image.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="flex flex-col items-center relative z-10">
          {/* Uploadable Avatar */}
          <div className="relative group">
            <button
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white cursor-pointer group-hover:bg-gray-100 transition-colors focus:outline-none"
              title="Upload profile image"
              onClick={() => editMode && fileRef.current?.click()}
              aria-label="Edit profile image"
              type="button"
              tabIndex={editMode ? 0 : -1}
              disabled={!editMode}
            >
              {profileImg ? (
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profileImg} alt="Profile" />
                  <AvatarFallback>
                    <Pencil size={40} className="text-yellow-600" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Pencil size={40} className="text-yellow-600 group-hover:text-yellow-700" />
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileRef}
                onChange={onFileChange}
                aria-label="Choose profile image"
                disabled={!editMode}
              />
            </button>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition text-center whitespace-nowrap bg-white px-2 py-1 rounded shadow border">
              Edit profile image
            </span>
          </div>
          <div className="text-xl font-semibold mt-4 text-yellow-300">
            {editMode ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center font-semibold bg-white/90"
                maxLength={30}
              />
            ) : (
              name
            )}
          </div>
          <div className="text-sm text-yellow-200 mb-1">
            {editMode ? (
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-center bg-white/90"
                maxLength={30}
              />
            ) : (
              role
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="px-6 pt-2 pb-6">
        <div className="text-xs font-semibold text-muted-foreground mb-1 mt-2">Basic Information</div>
        <ul className="text-sm space-y-1 mb-4">
          <li className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-yellow-600" />
            <span className="w-28">Birthday</span>
            <span className="flex-1 text-right">
              {editMode ? (
                <Input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  className="!m-0 py-0 pr-0 bg-white rounded border"
                  style={{ maxWidth: 150 }}
                />
              ) : (
                // Show formatted date
                new Date(birthday).toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" })
              )}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-yellow-600" />
            <span className="w-28">Phone number</span>
            <span className="flex-1 text-right">
              {editMode ? (
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="!m-0 py-0 pr-0 bg-white rounded border"
                  maxLength={18}
                  style={{ maxWidth: 160 }}
                />
              ) : (
                phone
              )}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-yellow-600" />
            <span className="w-28">E-Mail</span>
            <span className="flex-1 text-right truncate">
              <span className={editMode ? "bg-gray-100 cursor-not-allowed px-1 rounded" : ""}>
                {email}
              </span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-yellow-600" />
            <span className="w-28">City</span>
            <span className="flex-1 text-right">
              {editMode ? (
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="!m-0 py-0 pr-0 bg-white rounded border"
                  maxLength={30}
                  style={{ maxWidth: 120 }}
                />
              ) : (
                city
              )}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-yellow-600" />
            <span className="w-28">Address</span>
            <span className="flex-1 text-right">
              {editMode ? (
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="!m-0 py-0 pr-0 bg-white rounded border"
                  maxLength={50}
                  style={{ maxWidth: 175 }}
                />
              ) : (
                address
              )}
            </span>
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
        {editMode && (
          <Button onClick={handleSave} className="w-full mt-2 bg-yellow-600 text-white hover:bg-yellow-700">
            Save
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;