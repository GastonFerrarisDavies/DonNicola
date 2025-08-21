import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import UserActivityTracker from "@/components/UserActivityTracker";
import TokenRefreshNotification from "@/components/TokenRefreshNotification";

export const metadata = {
  title: "Don Nicola",
  description: "Don Nicola - Sistema de Gestión",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        <AuthProvider>
          <UserActivityTracker />
          <TokenRefreshNotification />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
