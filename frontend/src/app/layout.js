import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
