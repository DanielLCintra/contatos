// hooks/useStatistics.js (NOVO ARQUIVO)
import { useMemo } from 'react';

export const useStatistics = (contacts) => {
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

    return stats;
};