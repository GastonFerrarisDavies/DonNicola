import "./globals.css";
import "@radix-ui/themes/styles.css";


export const metadata = {
  title: "Don Nicola",
  description: "Don Nicola - Sistema de Gestión",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
