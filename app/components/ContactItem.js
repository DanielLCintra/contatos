import Link from 'next/link';
import { memo } from 'react';
import api from '../../utils/api';

const ContactItem = memo(({ contact, onRemove }) => {
    const handleRemove = async () => {
        try {
            // Tentar remover via API primeiro
            await api.delete(`/contacts/${contact.id}`);
            onRemove(contact.id);
        } catch (err) {
            // Se API falhar, remover apenas localmente
            console.log('API offline, removendo localmente');
            onRemove(contact.id);
        }
    };

    return (
        <li className="p-4 flex items-center justify-between">
            <div>
                <Link
                    href={`/contact/${contact.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                >
                    {contact.nome}
                </Link>
                <p className="text-sm text-gray-600">
                    {contact.email} • {contact.telefone}
                </p>
            </div>
            <button
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 px-2 py-1 rounded"
            >
                Excluir
            </button>
        </li>
    );
});

ContactItem.displayName = 'ContactItem';

export default ContactItem;