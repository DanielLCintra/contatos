"use client";
//Provider
import { ContactsProvider } from "./contexts/ContactsContext";

//Components
import ContactsPage from "./components/ContactsPage";

const HomePage = () => {
  return (
    <ContactsProvider>
      <ContactsPage />
    </ContactsProvider>
  );
};

export default HomePage;