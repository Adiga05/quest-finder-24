import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FileSearch, Plus, LogOut } from "lucide-react";

export function Header() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-glow transition-shadow">
            <FileSearch className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">DocSearch</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button asChild variant="default" className="gradient-primary hover:opacity-90 shadow-sm">
            <Link to="/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Document
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}