import React, { useState } from "react";
import { Mail } from "lucide-react";

const ContactsPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', login: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Ошибка отправки сообщения");
      setSuccess("Сообщение успешно отправлено!");
      setForm({ name: '', login: '', message: '' });
    } catch {
      setError("Не удалось отправить сообщение. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center px-4 max-w-md w-full">
        {/* Иконка */}
        <div className="mb-8">
          <Mail className="w-24 h-24 text-cinema-accent mx-auto" />
        </div>
        
        {/* Заголовок */}
        <h1 className="text-3xl font-bold mb-8">
          Контакты
        </h1>
        
        {/* Сообщение */}
        <p className="text-gray-300 mb-10">
          Если у вас есть вопросы или предложения, свяжитесь с нами:
        </p>

        {/* Форма обратной связи */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            className="w-full rounded px-4 py-3 bg-gray-900/50 text-white border border-gray-700 focus:border-cinema-accent outline-none"
            value={form.name}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="login"
            placeholder="Ваш логин"
            className="w-full rounded px-4 py-3 bg-gray-900/50 text-white border border-gray-700 focus:border-cinema-accent outline-none"
            value={form.login}
            onChange={handleChange}
            required
          />
          
          <textarea
            name="message"
            placeholder="Ваше сообщение"
            className="w-full rounded px-4 py-3 bg-gray-900/50 text-white border border-gray-700 focus:border-cinema-accent outline-none min-h-[120px] resize-none"
            value={form.message}
            onChange={handleChange}
            required
          />
          
          <button
            type="submit"
            className="w-full py-3 rounded bg-cinema-accent text-black font-bold hover:bg-cinema-accent/90 transition"
            disabled={loading}
          >
            {loading ? "Отправка..." : "Отправить сообщение"}
          </button>
          
          {success && <div className="text-green-400">{success}</div>}
          {error && <div className="text-red-400">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ContactsPage;