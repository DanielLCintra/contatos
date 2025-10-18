// hooks/useContactDetail.js (NOVO ARQUIVO)
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useContactsContext } from '../contexts/ContactsContext';

export const useContactDetail = () => {
    const params = useParams();
    const { getContact } = useContactsContext();
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                setLoading(true);
                setError(null);

                const contactData = await getContact(params.id);
                setContact(contactData);
            } catch (err) {
                console.error('Erro ao buscar contato:', err);
                setError(err.message || 'Erro ao carregar contato');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchContact();
        }
    }, [params.id, getContact]);

    return {
        contact,
        loading,
        error
    };
};