// hooks/useConnectionStatus.js (NOVO ARQUIVO)
import { useState, useEffect } from 'react';

export const useConnectionStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowStatus(true);
            // Esconder status após 3 segundos
            setTimeout(() => setShowStatus(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowStatus(true);
        };

        // Verificar status inicial
        setIsOnline(navigator.onLine);

        // Adicionar listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return {
        isOnline,
        showStatus,
        setIsOnline,
        setShowStatus
    };
};