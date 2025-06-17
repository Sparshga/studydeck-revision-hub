
import React, { useState } from "react";
import { Plus, Search, Filter, Grid, List, Upload, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import NoteCard from "@/components/NoteCard";
import AddNoteModal from "@/components/AddNoteModal";
import ImportPDFModal from "@/components/ImportPDFModal";
import CreateFolderModal from "@/components/CreateFolderModal";
import ViewFullModal from "@/components/ui/ViewFullModal";
import EditNoteModal from "@/components/ui/EditNoteModal";
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

const Notes = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Review UX Feedback",
      content: "In the Review UX Feedback session, will evaluate the feedback received regarding the user experience (UX).",
      tags: ["UX", "Design"],
      subject: "Design",
      createdAt: "Mar 13, 2024",
      updatedAt: "Mar 13, 2024",
      isMarkedForRevision: true,
      type: 'note'
    },
    {
      id: "2",
      title: "Mobile App Redesign",
      content: "Design Review: Mobile App Redesign focuses on evaluating and refining the updated design of a mobile application.",
      tags: ["Mobile", "Design"],
      subject: "Development",
      createdAt: "Mar 13, 2024",
      updatedAt: "Mar 13, 2024",
      isMarkedForRevision: false,
      type: 'note'
    }
  ]);

  const [folders, setFolders] = useState<Folder[]>([
    { id: "1", name: "Design System", color: "bg-blue-500" },
    { id: "2", name: "Mobile App", color: "bg-green-500" },
    { id: "3", name: "Website Design", color: "bg-purple-500" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isImportPDFModalOpen, setIsImportPDFModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isViewFullModalOpen, setIsViewFullModalOpen] = useState(false);
  const [selectedNoteForView, setSelectedNoteForView] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNoteForEdit, setSelectedNoteForEdit] = useState(null);
  const subjects = [...new Set(notes.map(note => note.subject))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || note.subject === selectedSubject;
    const matchesFolder = selectedFolder === "all" || note.folderId === selectedFolder;
    return matchesSearch && matchesSubject && matchesFolder;
  });

  const handleAddNote = (noteData) => {
    const newNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    };
    setNotes([...notes, newNote]);
    toast({ title: "Note added", description: "Note was successfully created." });
  };

  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find(note => note.id === noteId);
    setSelectedNoteForEdit(noteToEdit);
    setIsEditModalOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully.",
    });
  };

  const handleToggleRevision = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, isMarkedForRevision: !note.isMarkedForRevision }
        : note
    ));
    const note = notes.find(n => n.id === id);
    toast({
      title: note?.isMarkedForRevision ? "Removed from revision queue" : "Added to revision queue",
      description: note?.isMarkedForRevision ? "Note removed from revision queue." : "Note marked for revision.",
    });
  };

  const handleCreateFolder = (folderData: Omit<Folder, 'id'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: Date.now().toString(),
    };
    setFolders([...folders, newFolder]);
    toast({
      title: "Folder created",
      description: "New folder has been created successfully.",
    });
  };
  const handleViewFull = (noteId) => {
    const noteToView = notes.find(note => note.id === noteId);
    setSelectedNoteForView(noteToView);
    setIsViewFullModalOpen(true);
  };
  const handleImportPDF = (pdfData: { title: string; subject: string; tags: string[]; folderId?: string }) => {
    const newNote: Note = {
      ...pdfData,
      id: Date.now().toString(),
      content: "PDF content imported - ready for review and annotation",
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
      isMarkedForRevision: false,
      type: 'pdf'
    };
    setNotes([...notes, newNote]);
    toast({
      title: "PDF imported successfully",
      description: "Your PDF has been imported as a note.",
    });
  };

  return (
    <main className="min-h-screen bg-background dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-card dark:bg-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">My Notes</h1>
              <Badge variant="secondary" className="text-xs">
                {filteredNotes.length} notes
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateFolderModalOpen(true)}
                className="gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                New Folder
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportPDFModalOpen(true)}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Import PDF
              </Button>
              <Button
                onClick={() => setIsAddNoteModalOpen(true)}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4" />
                Add Notes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search notes, tags, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                {folders.map(folder => (
                  <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

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

        {/* Folders Display */}
        {folders.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Folders</h3>
            <div className="flex flex-wrap gap-2">
              {folders.map(folder => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFolder(selectedFolder === folder.id ? "all" : folder.id)}
                  className="gap-2"
                >
                  <div className={`w-2 h-2 rounded-full ${folder.color}`} />
                  {folder.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Notes Display */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No notes found</div>
            <Button
              onClick={() => setIsAddNoteModalOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create your first note
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-4"
          }>
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                folders={folders}
                viewMode={viewMode}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onToggleRevision={handleToggleRevision}
                onViewFull={handleViewFull}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onAdd={handleAddNote}
        folders={folders}
        subjects={subjects}
      />
      <ViewFullModal
        isOpen={isViewFullModalOpen}
        onClose={() => {
          setIsViewFullModalOpen(false);
          setSelectedNoteForView(null);
        }}
        note={selectedNoteForView}
        folders={folders}
      />
      <ImportPDFModal
        isOpen={isImportPDFModalOpen}
        onClose={() => setIsImportPDFModalOpen(false)}
        onImport={handleImportPDF}
        folders={folders}
        subjects={subjects}
      />
      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedNoteForEdit(null);
        }}
        note={selectedNoteForEdit}
        folders={folders}
        subjects={subjects}
        onSave={(noteData) => {
          setNotes(notes.map(note =>
            note.id === selectedNoteForEdit.id
              ? { ...note, ...noteData, updatedAt: new Date().toLocaleDateString() }
              : note
          ));
          toast({
            title: "Note updated",
            description: "Your note has been updated successfully.",
          });
          setIsEditModalOpen(false);
          setSelectedNoteForEdit(null);
        }}
      />
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreate={handleCreateFolder}
        folders={folders}
      />
    </main>
  );
};

export default Notes;
