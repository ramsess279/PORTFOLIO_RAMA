import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import { PortfolioProvider } from "@/hooks/usePortfolioContent";
import { Navbar } from "@/components/Navbar";
import Home from "./pages/Home";
import SeoManager from "@/components/SeoManager";
const About = lazy(() => import("./pages/About"));
const Experience = lazy(() => import("./pages/Experience"));
const Skills = lazy(() => import("./pages/Skills"));
const Education = lazy(() => import("./pages/Education"));
const Contact = lazy(() => import("./pages/Contact"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/Admin"));
const Resume = lazy(() => import("./pages/Resume"));

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
      <Suspense fallback={<div className="admin-loading"><span />Chargement…</div>}><Routes location={location}>
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
      </Routes></Suspense>
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
      <SeoManager />
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
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AppShell /></BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </PortfolioProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
