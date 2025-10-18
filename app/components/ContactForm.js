import { useForm } from "../hooks/useForm";

const ContactForm = () => {
    const { form, loading, error, handleChange, handleSubmit, nomeInputRef } = useForm();

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Nome</label>
                <input
                    ref={nomeInputRef}
                    name="nome"
                    className="w-full border rounded px-3 py-2 text-gray-900"
                    value={form.nome}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input
                    name="email"
                    type="email"
                    className="w-full border rounded px-3 py-2 text-gray-900"
                    value={form.email}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Telefone</label>
                <input
                    name="telefone"
                    className="w-full border rounded px-3 py-2 text-gray-900"
                    value={form.telefone}
                    onChange={handleChange}
                />
            </div>

            {error && (
                <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? 'Salvando...' : 'Adicionar Contato'}
            </button>
        </form>
    );
};

export default ContactForm;