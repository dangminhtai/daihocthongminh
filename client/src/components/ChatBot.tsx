import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatService, ChatMessage } from '../services/chatService';
import { ERROR_MESSAGES } from '../config/errors';
import LoadingSpinner from './common/LoadingSpinner';
import ConfirmModal from './common/ConfirmModal'; // Import component mới
import { Send, X, MessageCircle, Trash2 } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State cho modal
  const hasFetchedHistory = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const channelId = 'career-guidance';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasFetchedHistory.current) {
      const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const history = await ChatService.getHistory(channelId);
          setMessages(history);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
          setError(errorMessage);
        } finally {
          setIsLoading(false);
          hasFetchedHistory.current = true;
        }
      };

      fetchHistory();
      inputRef.current?.focus();
    }
  }, [isOpen, channelId]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      text: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await ChatService.sendMessage(channelId, currentInput);
      const modelMessage: ChatMessage = { text: response, role: 'model', timestamp: new Date() };
      // Cập nhật lại state sau khi nhận được phản hồi
      setMessages(prev => [...prev.filter(m => m !== userMessage), userMessage, modelMessage]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMessage);
      // Giữ lại tin nhắn của người dùng trên UI để họ có thể thử lại
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, channelId]);

  const handleClear = () => {
    setIsConfirmModalOpen(true); // Mở modal xác nhận tùy chỉnh
  };

  const handleConfirmClear = async () => {
    try {
      await ChatService.clearHistory(channelId);
      setMessages([]);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggleOpen = () => {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);
    if (!nextIsOpen) {
      // Reset history fetch flag when closing
      hasFetchedHistory.current = false;
    }
  }


  if (!isOpen) {
    return (
      <button
        onClick={handleToggleOpen}
        className="fixed bottom-6 right-6 bg-indigo-600 dark:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 z-50 animate-bounce"
        aria-label="Mở chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-slate-700">
        <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold">Trợ lý AI định hướng</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleClear} className="p-1 hover:bg-indigo-700 rounded transition-colors" aria-label="Xóa lịch sử" title="Xóa lịch sử">
              <Trash2 className="h-4 w-4" />
            </button>
            <button onClick={handleToggleOpen} className="p-1 hover:bg-indigo-700 rounded transition-colors" aria-label="Đóng chat">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
          {messages.length === 0 && !isLoading && !error && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8 flex flex-col items-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <p>Chào bạn! Tôi có thể giúp gì cho bạn về định hướng nghề nghiệp?</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-slate-600'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-700 rounded-lg p-3 border border-gray-200 dark:border-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          {error && (<div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm"> {error} </div>)}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-lg">
          <div className="flex gap-2">
            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Nhập câu hỏi của bạn..." className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent dark:text-white" disabled={isLoading} />
            <button onClick={handleSend} disabled={!input.trim() || isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-12">
              {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Send className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmClear}
        title="Xác nhận xóa lịch sử"
        message="Bạn có chắc chắn muốn xóa toàn bộ lịch sử cuộc trò chuyện này không? Hành động này không thể hoàn tác."
      />
    </>
  );
};

export default ChatBot;