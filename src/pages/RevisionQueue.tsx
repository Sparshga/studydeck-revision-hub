
import React, { useState } from "react";
import { Grid, List, Calendar, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import ThemeToggle from "@/components/ThemeToggle";
import NoteCard from "@/components/NoteCard";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  subject: string;
  createdAt: string;
  updatedAt: string;
  isMarkedForRevision: boolean;
  folderId?: string;
  type: 'note' | 'pdf';
}

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  color: string;
}

const RevisionQueue = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data for revision notes
  const [revisionNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Review UX Feedback",
      content: "In the Review UX Feedback session, will evaluate the feedback received regarding the user experience (UX). Key points to review include user navigation patterns, interface clarity, and accessibility improvements.",
      tags: ["UX", "Design", "Feedback"],
      subject: "Design",
      createdAt: "Mar 13, 2024",
      updatedAt: "Mar 13, 2024",
      isMarkedForRevision: true,
      type: 'note'
    },
    {
      id: "3",
      title: "React Hooks Concepts",
      content: "Understanding React Hooks - useState, useEffect, useContext, and custom hooks. Important concepts for modern React development.",
      tags: ["React", "Hooks", "Frontend"],
      subject: "Development",
      createdAt: "Mar 12, 2024",
      updatedAt: "Mar 12, 2024",
      isMarkedForRevision: true,
      type: 'note'
    },
    {
      id: "4",
      title: "Database Design Principles",
      content: "Key principles of database design including normalization, indexing, and relationship management. Essential for backend development.",
      tags: ["Database", "SQL", "Backend"],
      subject: "Backend",
      createdAt: "Mar 11, 2024",
      updatedAt: "Mar 11, 2024",
      isMarkedForRevision: true,
      type: 'pdf'
    }
  ]);

  const [folders] = useState<Folder[]>([
    { id: "1", name: "Design System", color: "bg-blue-500" },
    { id: "2", name: "Mobile App", color: "bg-green-500" },
    { id: "3", name: "Website Design", color: "bg-purple-500" }
  ]);

  const handleEditNote = (id: string, noteData: Partial<Note>) => {
    console.log("Edit note:", id, noteData);
  };

  const handleDeleteNote = (id: string) => {
    console.log("Delete note:", id);
  };

  const handleToggleRevision = (id: string) => {
    console.log("Toggle revision:", id);
  };

  return (
    <main className="min-h-screen bg-background dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-card dark:bg-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">Revision Queue</h1>
              <Badge variant="secondary" className="text-xs">
                {revisionNotes.length} notes for revision
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="flex border rounded-md">
                <Toggle
                  pressed={viewMode === "grid"}
                  onPressedChange={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid className="w-4 h-4" />
                </Toggle>
                <Toggle
                  pressed={viewMode === "list"}
                  onPressedChange={() => setViewMode("list")}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Toggle>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Notes</p>
                  <p className="text-2xl font-semibold">{revisionNotes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-semibold">{revisionNotes.filter(note => 
                    new Date(note.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                  ).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Grid className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                  <p className="text-2xl font-semibold">{new Set(revisionNotes.map(note => note.subject)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes for Revision */}
        {revisionNotes.length === 0 ? (
          <Card className="dark:bg-gray-800">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No notes marked for revision</h3>
              <p className="text-muted-foreground">
                Mark notes for revision from your notes page to see them here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Notes for Revision</h2>
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            }>
              {revisionNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  folders={folders}
                  viewMode={viewMode}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onToggleRevision={handleToggleRevision}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default RevisionQueue;
