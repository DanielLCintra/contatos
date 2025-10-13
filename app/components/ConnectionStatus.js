import { useConnectionStatus } from "../hooks/useConnectionStatus";

const ConnectionStatus = () => {
    const { isOnline, showStatus } = useConnectionStatus();

    return (
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-all duration-300 ${isOnline
            ? 'bg-green-100 text-green-800'
            : 'bg-orange-100 text-orange-800'
            }`}>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
            <span>
                {isOnline ? 'Online' : 'Offline'}
            </span>
            {isOnline && showStatus && (
                <span className="text-xs">✓ Sincronizado</span>
            )}
        </div>
    );
};

export default ConnectionStatus;