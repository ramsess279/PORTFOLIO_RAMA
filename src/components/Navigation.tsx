import { Home, GraduationCap, Briefcase, Code, Folder, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const navItems = [
    { id: "hero", label: "Accueil", icon: Home },
    { id: "formations", label: "Formations", icon: GraduationCap },
    { id: "experience", label: "Expérience", icon: Briefcase },
    { id: "competences", label: "Compétences", icon: Code },
    { id: "projets", label: "Projets", icon: Folder },
    { id: "qualites", label: "À propos", icon: Heart },
  ];

  const NavContent = () => (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "flex flex-row items-center justify-start gap-3 h-12 transition-all duration-300 w-full",
              isActive
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground scale-105"
                : "hover:bg-primary/10 hover:translate-x-1"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-base whitespace-nowrap">{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Bottom Navigation */}
      <nav className="hidden md:flex fixed bottom-0 left-0 w-full bg-white/80 glass border-t border-primary/20 z-50 justify-center items-center py-2 px-4 backdrop-blur-lg">
        <div className="flex w-full max-w-4xl justify-between items-center mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary">RG</h1>
            <p className="text-sm text-muted-foreground">Portfolio</p>
          </div>
          <div className="flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "flex flex-row items-center gap-2 h-12 transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground scale-105"
                      : "hover:bg-primary/10 hover:translate-y-1"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 glass border-t border-primary/20 z-50 flex justify-center items-center py-1 px-1 backdrop-blur-lg"
        style={{ minHeight: '60px' }}>
        <div className="flex w-full max-w-md justify-between items-center mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center transition-all duration-300 min-w-0 px-1",
                  isActive
                    ? "bg-primary text-primary-foreground scale-105"
                    : "hover:bg-primary/10"
                )}
                style={{ flex: 1, minWidth: 0, maxWidth: '60px' }}
              >
                <Icon className="h-5 w-5 md:h-6 md:w-6 mx-auto" />
                <span className="text-[10px] md:text-xs mt-0.5 whitespace-nowrap truncate w-full text-center">
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
