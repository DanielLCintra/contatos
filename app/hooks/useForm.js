// hooks/useForm.js (NOVO ARQUIVO)
import { useEffect, useRef, useState } from "react";
import { useContactsContext } from "../contexts/ContactsContext";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";

export const useForm = () => {
    const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const nomeInputRef = useRef(null);

    const { addContact, removeContact, contacts, loadContacts } = useContactsContext();

    useEffect(() => {
        nomeInputRef.current?.focus();
    }, []);

    useEffect(() => {
        return () => {
            console.log('ContactForm desmontado');
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nome.trim()) return; // Validação simples

        try {
            setLoading(true);
            setError(null);

            await addContact(form);
            setForm({ nome: "", email: "", telefone: "" });
            nomeInputRef.current?.focus();

        } catch (err) {
            setError('Erro ao adicionar contato');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await removeContact(id);
        } catch (err) {
            console.error('Erro ao remover contato:', err);
        }
    };

    return {
        form,
        loading,
        error,
        handleChange,
        handleSubmit,
        nomeInputRef,
        handleRemove
    };
}