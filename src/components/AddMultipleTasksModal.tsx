
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddMultipleTasksModalProps {
  onAddTasks: (tasks: string[]) => void;
}

export default function AddMultipleTasksModal({ onAddTasks }: AddMultipleTasksModalProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    // Split on newlines and trim empty lines
    const tasks = input.split("\n").map(s => s.trim()).filter(Boolean);
    if (tasks.length) {
      onAddTasks(tasks);
      setInput("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button" className="ml-2">Add multiple tasks</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="font-bold text-lg mb-2">Paste tasks (one per line)</div>
        </DialogHeader>
        <Textarea
          className="w-full"
          rows={6}
          placeholder="Task 1&#10;Task 2&#10;Task 3"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <DialogFooter>
          <Button variant="default" onClick={handleAdd}>Add tasks</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
