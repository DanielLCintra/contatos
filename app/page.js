"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import FilterInput from "./components/FilterInput";
import Statistcs from "./components/Statistcs";
import api from './utils/api';
import { cacheService } from './utils/cache';
import ConnectionStatus from "./components/ConnectionStatus";


const HomePage = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const syncPendingContacts = async () => {
      try {
        // Buscar contatos da API
        const response = await api.get('/contacts');
        const serverContacts = response.data;

        // Buscar contatos locais
        const localContacts = contacts;

        // Encontrar contatos que existem localmente mas não no servidor
        const pendingContacts = localContacts.filter(localContact => {
          // Se o ID é um timestamp (salvo offline), precisa sincronizar
          return typeof localContact.id === 'number' &&
            localContact.id > 1000000000000 && // Timestamp válido
            !serverContacts.some(serverContact =>
              serverContact.nome === localContact.nome &&
              serverContact.email === localContact.email &&
              serverContact.telefone === localContact.telefone
            );
        });

        // Enviar contatos pendentes para a API
        for (const pendingContact of pendingContacts) {
          try {
            const { id, ...contactData } = pendingContact;
            const response = await api.post('/contacts', contactData);

            // Atualizar o contato local com o ID da API
            setContacts(prev => prev.map(contact =>
              contact.id === pendingContact.id
                ? { ...contact, id: response.data.id }
                : contact
            ));

            console.log('Contato sincronizado:', contactData.nome);
          } catch (err) {
            console.error('Erro ao sincronizar contato:', err);
          }
        }

        // Atualizar com dados do servidor
        setContacts(serverContacts);
        cacheService.set(serverContacts);
        //localStorage.setItem('contatos', JSON.stringify(serverContacts));

      } catch (err) {
        console.error('Erro na sincronização:', err);
      }
    };

    const handleOnline = () => {
      setIsOffline(false);
      console.log('Voltou online - sincronizando...');
      syncPendingContacts();
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('Ficou offline - usando cache local');
    };

    // Verificar status inicial
    setIsOffline(!navigator.onLine);

    // Adicionar listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [contacts]);

  useEffect(() => {
    let isMounted = true; // Flag para verificar se componente ainda está montado

    const loadContacts = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        // Verificar cache primeiro
        const cachedContacts = cacheService.get();
        if (cachedContacts && isMounted) {
          setContacts(cachedContacts);
          setLoading(false);
        }

        // Tentar carregar da API
        try {
          const response = await api.get('/contacts');
          const apiContacts = response.data;

          if (isMounted) {
            // Salvar no cache service
            cacheService.set(apiContacts);
            setContacts(apiContacts);
            setIsOffline(false);
          }
        } catch (apiError) {
          // Se API falhar e não há cache, mostrar erro
          if (isMounted) {
            if (!cachedContacts) {
              setIsOffline(true);
              setError('Erro ao carregar contatos e sem cache disponível.');
            } else {
              setIsOffline(true);
              console.log('API offline, usando cache');
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Erro ao carregar contatos');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContacts();

    // CLEANUP: Executado quando componente é desmontado
    return () => {
      isMounted = false;
      console.log('Componente desmontado - cancelando requisições');
    };
  }, []);

  // useEffect(() => {
  //   const savedContacts = localStorage.getItem('contatos');
  //   if (savedContacts) {
  //     setContacts(JSON.parse(savedContacts));
  //   }
  //   setIsLoaded(true);
  // }, []);

  // useEffect(() => {
  //   if (isLoaded) {
  //     localStorage.setItem('contatos', JSON.stringify(contacts));
  //   }
  // }, [contacts, isLoaded]);

  const handleSubmit = useCallback((newContact) => {
    setContacts(prev => [...prev, newContact]);
  }, []);


  const handleRemove = useCallback((id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  const handleFilterChange = useCallback((value) => {
    setFilter(value);
  }, []);

  const filteredContacts = useMemo(() => {
    console.log('Filtrando contatos...'); // Só executa quando contacts ou filter mudam

    if (!filter.trim()) {
      return contacts;
    }

    return contacts.filter(contact =>
      contact.nome.toLowerCase().includes(filter.toLowerCase()) ||
      contact.email.toLowerCase().includes(filter.toLowerCase()) ||
      contact.telefone.includes(filter)
    );
  }, [contacts, filter]);

  const stats = useMemo(() => {
    console.log('Calculando estatísticas...');

    const total = contacts.length;
    const comEmail = contacts.filter(c => c.email).length;
    const comTelefone = contacts.filter(c => c.telefone).length;

    return {
      total,
      comEmail,
      comTelefone,
      semEmail: total - comEmail,
      semTelefone: total - comTelefone
    };
  }, [contacts]);


  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Contatos</h1>
          <FilterInput value={filter} onChange={handleFilterChange} />
          <ConnectionStatus />
        </header>

        <ContactForm onAdd={handleSubmit} />

        {loading && (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
            <p className="mt-2">Carregando contatos...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <i className="fas fa-exclamation-circle text-2xl text-red-600"></i>
            <p className="mt-2 text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <ContactList items={filteredContacts} onRemove={handleRemove} />

            <Statistcs stats={stats} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;