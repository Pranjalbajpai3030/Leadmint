import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { GoogleOAuthProvider } from "@react-oauth/google";
// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddCustomersPage from "./pages/AddCustomersPage";
import AddOrdersPage from "./pages/AddOrdersPage";
import SegmentBuilderPage from "./pages/SegmentBuilderPage";
import PreviewAudiencePage from "./pages/PreviewAudiencePage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import CampaignHistoryPage from "./pages/CampaignHistoryPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => {
  const CLIENT_ID =
    import.meta.env.VITE_APP_GOOGLE_CLIENT_ID || "google-client-id";
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<Layout />}>
              {/* Protected routes would normally check auth state */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/add-customers" element={<AddCustomersPage />} />
              <Route path="/add-orders" element={<AddOrdersPage />} />
              <Route path="/segment-builder" element={<SegmentBuilderPage />} />
              <Route
                path="/preview-audience"
                element={<PreviewAudiencePage />}
              />
              <Route path="/create-campaign" element={<CreateCampaignPage />} />
              <Route
                path="/campaign-history"
                element={<CampaignHistoryPage />}
              />
              <Route
                path="/campaign/:id/details"
                element={<CampaignDetailsPage />}
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
