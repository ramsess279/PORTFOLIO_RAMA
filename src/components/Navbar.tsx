import { Home, User, Briefcase, Code, GraduationCap, Mail, FolderOpen } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const menuItems = [
  { title: "Accueil", url: "/", icon: Home },
  { title: "À propos", url: "/about", icon: User },
  { title: "Compétences", url: "/skills", icon: Code },
  { title: "Projets", url: "/projects", icon: FolderOpen },
  { title: "Expériences", url: "/experience", icon: Briefcase },
  { title: "Formation", url: "/education", icon: GraduationCap },
  { title: "Contact", url: "/contact", icon: Mail },
];

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            {/* Avatar supprimé */}
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/50 shadow-glow-sm"
                      : "bg-background/50 hover:bg-primary/10 border border-transparent hover:border-primary/30"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.title}</span>
              </NavLink>
            ))}

            {/* Theme Toggle */}
            <div className="ml-2 pl-2 border-l border-border/50">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};