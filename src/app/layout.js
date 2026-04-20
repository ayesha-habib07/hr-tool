import "./globals.css";
import GlobalChat from "../components/GlobalChat";

export const metadata = {
  title: "HR Tool",
  description: "HR Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative">
       
        <div className="min-h-screen">{children}</div>
        <GlobalChat />
      </body>
    </html>
  );
}
