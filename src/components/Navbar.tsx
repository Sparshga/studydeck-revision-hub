
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FancyLogoutButton from "@/components/FancyLogoutButton";

const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/notes", label: "Notes" },
  { path: "/add-note", label: "Add Note" },
  { path: "/revision-queue", label: "Revision Queue" },
  { path: "/settings", label: "Settings" },
];

const Navbar = () => {
  const location = useLocation();
  // Placeholder: not logged in if at /login or /signup
  const isAuth = !(location.pathname === "/login" || location.pathname === "/signup");
  return (
    <nav className="w-full border-b p-4 bg-background flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-primary">🧠 StudyDeck</Link>
      <div className="flex gap-2">
        {isAuth ? (
          <>
            {navItems.map(({ path, label }) => (
              <Button
                key={path}
                asChild
                variant={location.pathname === path ? "secondary" : "ghost"}
                size="sm"
              >
                <Link to={path}>{label}</Link>
              </Button>
            ))}
            <FancyLogoutButton />
          </>
        ) : (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
