// contexts/ContactsContext.js (NOVO ARQUIVO)
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { cacheService } from '../utils/cache';

// 1. Criar o Context
const ContactsContext = createContext();

// 2. Hook customizado para usar o Context
export const useContactsContext = () => {
    const context = useContext(ContactsContext);
    if (!context) {
        throw new Error('useContactsContext deve ser usado dentro de ContactsProvider');
    }
    return context;
};

// 3. Provider Component
export const ContactsProvider = ({ children }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOffline, setIsOffline] = useState(false);

    const loadContacts = useCallback(async () => {
        let isMounted = true;

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
    }, []);

    const addContact = useCallback(async (newContact) => {
        try {
            // Tentar salvar via API primeiro
            try {
                const response = await api.post('/contacts', newContact);
                const contactWithId = { ...newContact, id: response.data.id };
                setContacts(prev => {
                    const updated = [...prev, contactWithId];
                    cacheService.set(updated);
                    return updated;
                });
                return contactWithId;
            } catch (apiError) {
                // Se API falhar, salvar localmente
                console.log('API offline, salvando localmente');
                const contactWithId = { ...newContact, id: Date.now() };
                setContacts(prev => {
                    const updated = [...prev, contactWithId];
                    cacheService.set(updated);
                    return updated;
                });
                return contactWithId;
            }
        } catch (err) {
            throw new Error('Erro ao adicionar contato');
        }
    }, []);

    const removeContact = useCallback(async (id) => {
        try {
            // Tentar excluir via API primeiro
            try {
                await api.delete(`/contacts/${id}`);
                console.log('Contato excluído da API');
            } catch (apiError) {
                // Se API falhar, apenas remover localmente
                console.log('API offline, removendo apenas localmente');
            }

            // Remover da lista local em ambos os casos
            setContacts(prev => {
                const updated = prev.filter(c => c.id !== id);
                // Atualizar cache
                cacheService.set(updated);
                return updated;
            });
        } catch (err) {
            console.error('Erro ao remover contato:', err);
            throw new Error('Erro ao remover contato');
        }
    }, []);

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

    // Buscar contato específico por ID
    const getContact = useCallback(async (id) => {
        try {
            // Primeiro, tentar buscar da API
            try {
                const response = await api.get(`/contacts/${id}`);
                return response.data;
            } catch (apiError) {
                // Se API falhar, buscar do cache local
                console.log('API offline, buscando do cache local');
                const cachedContacts = cacheService.get();
                if (cachedContacts) {
                    const foundContact = cachedContacts.find(c => c.id === parseInt(id));
                    if (foundContact) {
                        return foundContact;
                    }
                }
                throw new Error('Contato não encontrado');
            }
        } catch (err) {
            console.error('Erro ao buscar contato:', err);
            throw err;
        }
    }, []);

    // Carregar contatos na inicialização
    useEffect(() => {
        loadContacts();
    }, [loadContacts]);

    // Valor do Context
    const value = {
        contacts,
        loading,
        error,
        isOffline,
        addContact,
        removeContact,
        loadContacts,
        getContact
    };

    return (
        <ContactsContext.Provider value={value}>
            {children}
        </ContactsContext.Provider>
    );
};

export default ContactsContext;