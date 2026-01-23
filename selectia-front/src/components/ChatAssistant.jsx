// src/components/ChatAssistant.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Historial de mensajes inicial
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: '¡Hola Jesús! Soy tu asistente de IA. 🤖 Puedo ayudarte a mejorar tu CV, buscar vacantes o prepararte para una entrevista. ¿Qué necesitas hoy?' 
    }
  ]);

  // Función para hacer scroll automático hacia abajo
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Simulación de respuesta de la IA (Lógica Mock)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Agregar mensaje del usuario
    const newMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true); // Activar animación de carga

    // 2. Simular "pensamiento" de la IA (retraso de 1.5 segundos)
    setTimeout(() => {
        let aiResponse = "Entiendo. ¿Podrías darme más detalles?";
        const lowerInput = newMsg.text.toLowerCase();

        // Respuestas predefinidas simples para la demo
        if (lowerInput.includes('hola')) aiResponse = "¡Hola de nuevo! ¿Listo para encontrar trabajo?";
        else if (lowerInput.includes('cv') || lowerInput.includes('currículum')) aiResponse = "Te recomiendo subir tu CV en formato PDF. Nuestra IA extraerá tus habilidades automáticamente. ¿Quieres que te lleve a la sección de carga?";
        else if (lowerInput.includes('vacante') || lowerInput.includes('trabajo')) aiResponse = "He encontrado 3 vacantes nuevas que coinciden un 95% con tu perfil de React. ¿Te gustaría verlas?";
        else if (lowerInput.includes('entrevista')) aiResponse = "Para tu entrevista, recuerda investigar a la empresa. ¿Quieres que simulemos una entrevista técnica rápida?";
        else aiResponse = "Interesante. Como soy una IA en entrenamiento, estoy procesando tu solicitud para darte la mejor recomendación.";

        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
        setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* --- BOTÓN FLOTANTE (FAB) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group ${isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-r from-brand-primary to-blue-600'}`}
      >
        {isOpen ? (
            <X className="text-white w-6 h-6" />
        ) : (
            <div className="relative">
                <Bot className="text-white w-7 h-7" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            </div>
        )}
      </button>

      {/* --- VENTANA DEL CHAT --- */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] max-h-[80vh] bg-brand-surface border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            
            {/* Header */}
            <div className="bg-brand-dark/90 backdrop-blur-md p-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-blue-500 flex items-center justify-center">
                    <Sparkles className="text-white w-5 h-5 animate-pulse" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">SelectBot IA</h3>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> En línea
                    </p>
                </div>
            </div>

            {/* Cuerpo de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === 'user' 
                            ? 'bg-brand-primary text-white rounded-tr-none' 
                            : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {/* Animación de "Escribiendo..." */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-0"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-brand-surface border-t border-white/10 flex gap-2">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escribe tu duda..."
                    className="flex-1 bg-brand-dark border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
                />
                <button 
                    type="submit"
                    className="bg-brand-primary hover:bg-violet-600 text-white p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!inputValue.trim()}
                >
                    <Send size={18} />
                </button>
            </form>

        </div>
      )}
    </>
  );
};

export default ChatAssistant;