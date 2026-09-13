import { Home, User, Briefcase, Code, GraduationCap, Mail, FolderOpen } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

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
  const { theme } = useTheme();

  return (
    <nav className="fixed md:top-0 bottom-0 md:bottom-auto left-0 right-0 z-50 glass border-t md:border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-2">
        <div className="flex items-center h-16 min-w-max relative">
          {/* Logo/Brand */}
          <div className="hidden md:flex items-center absolute left-2">
            <img
              src={theme === "dark" ? "/branding/logo-a-lavishly-yours-dark.png" : "/branding/logo-a-lavishly-yours-light.png"}
              alt="RG"
              className="h-10 w-auto"
            />
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-1 mx-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-primary/10 border border-transparent hover:border-primary/30"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.title}</span>
              </NavLink>
            ))}

          </div>

          {/* Theme toggle */}
          <div className="absolute right-2 flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};