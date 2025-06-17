import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  Folder, 
  Tag, 
  BookOpen,
  Star,
  X
} from "lucide-react";

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

interface ViewFullModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  folders: Folder[];
}

const ViewFullModal: React.FC<ViewFullModalProps> = ({
  isOpen,
  onClose,
  note,
  folders,
}) => {
  if (!note) return null;

  const folder = folders.find(f => f.id === note.folderId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {note.type === 'pdf' ? (
                <FileText className="w-6 h-6 text-red-500" />
              ) : (
                <FileText className="w-6 h-6 text-blue-500" />
              )}
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {note.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {note.subject}
                  </Badge>
                  {note.isMarkedForRevision && (
                    <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Marked for Revision
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Metadata Section */}
          <div className="border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Created: {note.createdAt}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Updated: {note.updatedAt}</span>
              </div>
              {folder && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Folder className="w-4 h-4" />
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${folder.color}`} />
                    <span>{folder.name}</span>
                  </div>
                </div>
              )}
              {note.tags.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  <span>{note.tags.length} tag{note.tags.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags Section */}
          {note.tags.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {note.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Content Section */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              {note.type === 'pdf' ? (
                <>
                  <FileText className="w-4 h-4 text-red-500" />
                  PDF Content
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-blue-500" />
                  Note Content
                </>
              )}
            </h3>
            
            {note.type === 'pdf' ? (
              <div className="border rounded-lg p-6 bg-muted/10">
                <div className="text-center space-y-4">
                  <FileText className="w-16 h-16 text-red-500 mx-auto" />
                  <div>
                    <p className="font-medium text-lg">{note.title}</p>
                    <p className="text-muted-foreground mt-2">
                      PDF content preview would be displayed here.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      In a real implementation, you would integrate a PDF viewer component.
                    </p>
                  </div>
                  <Button variant="outline" className="mt-4">
                    <FileText className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-background">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {note.content}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewFullModal;