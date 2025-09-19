import "./globals.css";

export const metadata = {
  title: "HR Tool",
  description: "HR Management System",
};

export default function RootLayout({ children }) {
  return (        
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
