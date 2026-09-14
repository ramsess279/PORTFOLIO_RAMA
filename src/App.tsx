import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import { PortfolioProvider } from "@/hooks/usePortfolioContent";
import { Navbar } from "@/components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Skills from "./pages/Skills";
import Education from "./pages/Education";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Resume from "./pages/Resume";

const queryClient = new QueryClient();

const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (hash) document.querySelector(hash)?.scrollIntoView();
      else window.scrollTo({ top: 0, left: 0 });
    });
  }, [pathname, hash]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/education" element={<Education />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cv" element={<Resume />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const AppShell = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const isStandalone = isAdmin || pathname === "/cv";

  return (
    <>
      <ScrollManager />
      {!isStandalone && <Navbar />}
      <main className={isAdmin ? "admin-main" : undefined}><AnimatedRoutes /></main>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <PortfolioProvider>
        <TooltipProvider>
          <BrowserRouter><AppShell /></BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </PortfolioProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
