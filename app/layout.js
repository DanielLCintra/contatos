"use client";
import "./globals.css";
import { ContactsProvider } from "./contexts/ContactsContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ContactsProvider>
          {children}
        </ContactsProvider>
      </body>
    </html>
  );
}
