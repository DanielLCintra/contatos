// hooks/useFilter.js (NOVO ARQUIVO)
import { useState, useMemo, useCallback } from 'react';

export const useFilter = (contacts) => {
    const [filter, setFilter] = useState('');

    const handleFilterChange = useCallback((value) => {
        setFilter(value);
    }, []);

    const filteredContacts = useMemo(() => {
        console.log('Filtrando contatos...');

        if (!filter.trim()) {
            return contacts;
        }

        return contacts.filter(contact =>
            contact.nome.toLowerCase().includes(filter.toLowerCase()) ||
            contact.email.toLowerCase().includes(filter.toLowerCase()) ||
            contact.telefone.includes(filter)
        );
    }, [contacts, filter]);

    return {
        filter,
        filteredContacts,
        handleFilterChange
    };
};