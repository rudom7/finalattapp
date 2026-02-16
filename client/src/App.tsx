import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { useTour, TourProvider } from "./hooks/use-tour";
import { SystemTour } from "./components/system-tour";
import { Providers } from "./components/providers";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Queries from "@/pages/queries";
import Claims from "@/pages/claims";
import Overview from "@/pages/overview";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import Regulations from "./pages/regulations";

// Tour manager component to render the tour UI for all protected routes
function TourManager() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <SystemTour userRole={user.role as "admin" | "superadmin" | "supervisor"} />
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/queries" component={Queries} />
      <ProtectedRoute path="/claims" component={Claims} />
      <ProtectedRoute path="/regulations" component={Regulations} />
      <ProtectedRoute 
        path="/overview" 
        component={Overview} 
        requiredRole={["superadmin", "supervisor"]}
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Providers>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TourProvider>
            <Router />
            <TourManager />
          </TourProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Providers>
  );
}

export default App;