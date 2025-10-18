"use client";

//Components
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import FilterInput from "./components/FilterInput";
import Statistcs from "./components/Statistcs";
import ConnectionStatus from "./components/ConnectionStatus";

//Hooks
import { useFilter } from "./hooks/useFilter";
import { useStatistics } from "./hooks/useStatistics";

//Contexts
import { useContactsContext } from "./contexts/ContactsContext";

const HomePage = () => {
  // Usar Context em vez de props
  const contactsData = useContactsContext();
  const { filter, filteredContacts, handleFilterChange } = useFilter(contactsData.contacts);
  const stats = useStatistics(contactsData.contacts);

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Contatos</h1>
          <div className="flex items-center space-x-4">
            <FilterInput
              value={filter}
              onChange={handleFilterChange}
            />
            <ConnectionStatus />
          </div>
        </header>

        <ContactForm />

        {/* Estados de loading e erro mantidos da aula anterior */}
        {contactsData.loading && (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
            <p className="mt-2">Carregando contatos...</p>
          </div>
        )}

        {contactsData.error && (
          <div className="text-center py-8">
            <i className="fas fa-exclamation-circle text-2xl text-red-600"></i>
            <p className="mt-2 text-red-600">{contactsData.error}</p>
            <button
              onClick={contactsData.loadContacts}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Renderização condicional mantida da aula anterior */}
        {!contactsData.loading && !contactsData.error && (
          <ContactList
            items={filteredContacts}
            onRemove={contactsData.removeContact}
          />
        )}

        <Statistcs stats={stats} />
      </div>
    </div>
  );
};

export default HomePage;