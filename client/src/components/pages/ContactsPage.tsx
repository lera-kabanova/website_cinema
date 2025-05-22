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
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center px-4 mt-32">
      <Mail className="w-12 h-12 text-cinema-accent mb-4" />
      <h1 className="text-3xl font-bold mb-6 text-cinema-accent">Контакты</h1>
      <div className="text-gray-200 space-y-4 text-lg max-w-2xl mb-8">
        <p>Если у вас есть вопросы или предложения, свяжитесь с нами:</p>
        <ul className="list-disc pl-6 space-y-2 text-left mx-auto inline-block">
          <li>Email: <a href="mailto:cinemawebwelcome@gmail.com" className="text-cinema-accent hover:underline">cinemawebwelcome@gmail.com</a></li>
          <li>Телефон: <a href="tel:+79999999999" className="text-cinema-accent hover:underline">+375 (29) 234-34-89</a></li>
        </ul>
        <p>Или воспользуйтесь формой обратной связи ниже:</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/10 rounded-lg p-6 flex flex-col gap-4 items-center">
        <input
          type="text"
          name="name"
          placeholder="Ваше имя"
          className="w-full rounded px-3 py-2 bg-black/40 text-white border border-white/20 focus:border-cinema-accent outline-none"
          value={form.name}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="login"
          placeholder="Ваш логин"
          className="w-full rounded px-3 py-2 bg-black/40 text-white border border-white/20 focus:border-cinema-accent outline-none"
          value={form.login}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Ваше сообщение"
          className="w-full rounded px-3 py-2 bg-black/40 text-white border border-white/20 focus:border-cinema-accent outline-none min-h-[100px] resize-y"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-cinema-accent hover:bg-cinema-accent/90 text-white font-bold transition"
          disabled={loading}
        >
          {loading ? "Отправка..." : "Отправить"}
        </button>
        {success && <div className="text-green-400 text-sm mt-2">{success}</div>}
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default ContactsPage; 