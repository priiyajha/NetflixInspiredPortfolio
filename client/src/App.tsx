import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePerformanceObserver } from "@/hooks/use-performance-observer";
import Home from "@/pages/home";
import ProjectsPage from "@/pages/projects";
import ContactPage from "@/pages/contact";
import LetsChatPage from "@/pages/lets-chat";
import NetflixSearchPage from "@/pages/netflix-search";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/lets-chat" component={LetsChatPage} />
      <Route path="/netflix-search" component={NetflixSearchPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Monitor performance for optimization
  usePerformanceObserver();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
