import { useState, useRef, useEffect } from "react";
import { apiFetch } from "../lib/api";

interface Message {
    id: number;
    sender: "user" | "bot";
    text: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: "bot", text: "Hi!, I'm your AI Sales Assistant. I can help you find games based on price, genre, or name. Try asking: 'Find me a cheap RPG!'" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom }, [messages, isOpen]);
    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), sender: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);
        try {
            const res = await apiFetch("/agent/chat", {
                method: "POST",
                body: JSON.stringify({ message: userMsg.text })
            });
            const data = await res.json();
            const botMsg: Message = { id: Date.now() + 1, sender: "bot", text: data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now(), sender: "bot", text: "Sorry, my brain is offline. Try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-fade-in-up">

                    {/* Header */}
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <h3 className="font-bold">AI Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${msg.sender === "user"
                                        ? "bg-blue-600 text-white self-end rounded-br-none"
                                        : "bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none shadow-sm"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="self-start bg-gray-200 text-gray-500 text-xs px-3 py-2 rounded-full animate-pulse">
                                Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for a recommendation..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}

            {/* FLOATING BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
            >
                {isOpen ? (
                    <span className="text-xl font-bold">✕</span>
                ) : (
                    <span className="text-3xl">💬</span>
                )}
            </button>
        </div>
    )
}