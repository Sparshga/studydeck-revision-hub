import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import AddNote from "./pages/AddNote";
import RevisionQueue from "./pages/RevisionQueue";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NoteDetail from "./pages/NoteDetail";
import NotFound from "./pages/NotFound";
import ReactiveBackground from "@/components/ReactiveBackground";

const queryClient = new QueryClient();

const App = () => (
  <>
    <ReactiveBackground />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/add-note" element={<AddNote />} />
            <Route path="/revision-queue" element={<RevisionQueue />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </>
);

export default App;
