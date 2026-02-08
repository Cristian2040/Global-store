import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Utensils, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: '¡Hola! Soy GastroBot 🤖. ¿Buscas alguna receta o inspiración culinaria hoy?', sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // Add user message
        const newUserMsg: Message = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, newUserMsg]);
        setInputText('');

        // Simulate bot response
        setTimeout(() => {
            const botResponses = [
                "¡Qué interesante! Para eso te recomiendo usar ingredientes frescos de nuestras tiendas locales.",
                "Esa suena como una excelente idea para la cena. ¿Has probado agregar un poco de albahaca fresca?",
                "¡Mmm! Puedo buscarte una receta rápida para eso. ¿Prefieres algo vegetariano o con carne?",
                "Tengo una receta secreta de la abuela para eso. 😉",
                "Recuerda que puedes pedir todos los ingredientes necesarios directamente aquí en GlobalStore."
            ];
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

            const newBotMsg: Message = { id: Date.now() + 1, text: randomResponse, sender: 'bot' };
            setMessages(prev => [...prev, newBotMsg]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-80 h-96 mb-4 flex flex-col shadow-2xl border-cyan-500/30 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/20 rounded-full">
                                <Utensils className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">GastroBot</h3>
                                <p className="text-xs text-cyan-100 flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 inline-block"></span>
                                    En línea
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900/95 scrollbar-thin scrollbar-thumb-gray-700">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-cyan-600 text-white rounded-tr-none'
                                        : 'bg-gray-700 text-gray-200 rounded-tl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Escribe tu consulta..."
                            className="flex-1 bg-gray-700 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600 placeholder-gray-400"
                        />
                        <Button
                            type="submit"
                            size="sm"
                            className="rounded-full w-10 h-10 p-0 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                            disabled={!inputText.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </Card>
            )}

            {/* Floating Button with Notification */}
            {!isOpen && (
                <div className="relative group">
                    {/* Notification Bubble */}
                    <div className="absolute bottom-full right-0 mb-4 w-48 bg-white text-gray-900 p-3 rounded-xl shadow-xl animate-bounce-subtle pointer-events-none transform origin-bottom-right">
                        <div className="text-sm font-bold mb-1">👋 ¡Hola! Soy GastroBot</div>
                        <div className="text-xs text-gray-600">¿Necesitas una receta hoy?</div>
                        {/* Triangle arrow */}
                        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
                    </div>

                    <Button
                        onClick={() => setIsOpen(true)}
                        className="h-16 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-slow ring-4 ring-cyan-500/30"
                    >
                        <Bot className="w-8 h-8" />
                    </Button>
                </div>
            )}
        </div>
    );
};
