"use client";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ContactsProvider } from "./contexts/ContactsContext";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ContactsProvider>
            {children}
          </ContactsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}