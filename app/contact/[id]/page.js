"use client";

import { useRouter } from 'next/navigation';
import { useContactDetail } from '@/app/hooks/useContactDetail';
import { useAuth } from '@/app/hooks/useAuth';
import ProtectedRoute from '@/app/components/ProtectedRoute';


const ContactDetailPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { contact, loading, error } = useContactDetail();

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex items-center justify-center">
                                <i className="fas fa-spinner fa-spin text-2xl text-blue-600 mr-3"></i>
                                <p className="text-gray-600">Carregando contato...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error || !contact) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Erro</h1>
                                <button
                                    onClick={() => router.back()}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded"
                                >
                                    ← Voltar
                                </button>
                            </div>
                            <div className="text-center">
                                <i className="fas fa-exclamation-circle text-3xl text-red-600 mb-4"></i>
                                <p className="text-gray-600">{error || 'Contato não encontrado'}</p>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Ir para Lista de Contatos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Detalhes do Contato</h1>
                                <p className="text-sm text-gray-600">Visualizado por: {user?.name}</p>
                            </div>
                            <button
                                onClick={() => router.back()}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded"
                            >
                                ← Voltar
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                                <p className="text-gray-500 text-sm">{contact.id}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <p className="text-gray-900 text-lg">{contact.nome}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <p className="text-gray-900">
                                    {contact.email ? (
                                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                                            {contact.email}
                                        </a>
                                    ) : (
                                        <span className="text-gray-500">Não informado</span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                <p className="text-gray-900">
                                    {contact.telefone ? (
                                        <a href={`tel:${contact.telefone}`} className="text-blue-600 hover:underline">
                                            {contact.telefone}
                                        </a>
                                    ) : (
                                        <span className="text-gray-500">Não informado</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default ContactDetailPage;