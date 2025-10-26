const LoadingSpinner = ({ message = "Carregando...", size = "text-3xl" }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <i className={`fas fa-spinner fa-spin ${size} text-blue-600 mb-4`}></i>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;