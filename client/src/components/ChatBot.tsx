import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatService } from '../services/chatService';
import { ChatMessage, IMessagePart } from '../class/types';
import { ERROR_MESSAGES } from '../config/errors';
import ConfirmModal from './common/ConfirmModal';
import { Send, X, MessageCircle, Trash2, Search, Paperclip, File as FileIcon } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const hasFetchedHistory = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const channelId = 'career-guidance';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
        if (!hasFetchedHistory.current) {
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
        }
      inputRef.current?.focus();
    }
  }, [isOpen, channelId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.size > 25 * 1024 * 1024) { // 25MB limit
            setError('File quá lớn. Vui lòng chọn file dưới 25MB.');
            return;
        }
        setFile(selectedFile);
        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFilePreview(null);
        }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = useCallback(async () => {
    if ((!input.trim() && !file) || isLoading) return;

    const userMessageParts: IMessagePart[] = [];
    if (input.trim()) {
      userMessageParts.push({ text: input.trim() });
    }
    if (file) {
      const fileData: IMessagePart['fileData'] = { mimeType: file.type };
      if (filePreview) {
        fileData.localPreviewUrl = filePreview;
      }
      userMessageParts.push({ fileData });
    }

    const userMessage: ChatMessage = {
      parts: userMessageParts,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    const currentFile = file;
    setInput('');
    removeFile();
    setIsLoading(true);
    setError(null);

    try {
      const modelMessage = await ChatService.sendMessage(channelId, currentInput, useGoogleSearch, currentFile);
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMessage);
      setMessages(prev => prev.filter(msg => msg !== userMessage));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, channelId, useGoogleSearch, file, filePreview]);

  const handleClear = () => setIsConfirmModalOpen(true);
  
  const handleConfirmClear = async () => {
    try {
      await ChatService.clearHistory(channelId);
      setMessages([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR);
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
      if(!nextIsOpen) {
          hasFetchedHistory.current = false;
          // Dọn dẹp state khi đóng chat
          setMessages([]);
          setError(null);
          setFile(null);
          setFilePreview(null);
      }
  };
  
  const renderPart = (part: IMessagePart, index: number) => {
    if (part.text) {
        return <p key={index} className="text-sm whitespace-pre-wrap">{part.text}</p>;
    }
    if (part.fileData) {
        const uri = part.fileData.localPreviewUrl || part.fileData.fileUri;
        if (!uri) return null;

        if (part.fileData.mimeType?.startsWith('image/')) {
            return <img key={index} src={uri} alt="Uploaded content" className="mt-2 rounded-lg max-w-full h-auto max-h-60" />;
        }
        if (part.fileData.mimeType?.startsWith('audio/')) {
            return <audio key={index} controls src={uri} className="mt-2 w-full" />;
        }
        return (
            <a key={index} href={uri} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 p-2 bg-slate-200 dark:bg-slate-600 rounded-lg text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                <FileIcon className="w-4 h-4" /> Tải xuống file
            </a>
        );
    }
    return null;
  };

  if (!isOpen) return (
      <button onClick={handleToggleOpen} className="fixed bottom-6 right-6 bg-indigo-600 dark:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 z-50 animate-bounce" aria-label="Mở chat">
        <MessageCircle className="h-6 w-6" />
      </button>
  );

  return (
    <>
      <div className="fixed bottom-6 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-slate-700">
        <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold">Trợ lý AI định hướng</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setUseGoogleSearch(!useGoogleSearch)} 
              className={`p-1 rounded transition-colors ${useGoogleSearch ? 'bg-white/30' : 'hover:bg-indigo-700'}`} 
              aria-label="Bật/Tắt Google Search" 
              title="Sử dụng Google Search để có thông tin mới nhất"
            >
              <Search className={`h-4 w-4 ${useGoogleSearch ? 'text-yellow-300' : 'text-white'}`} />
            </button>
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
                {msg.parts.map(renderPart)}
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

          {error && ( <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm"> {error} </div> )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-lg">
            {file && (
                <div className="mb-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-between animate-fade-in">
                    {filePreview ? (
                         <img src={filePreview} alt="Preview" className="w-12 h-12 object-cover rounded"/>
                    ) : (
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 flex items-center justify-center rounded">
                             <FileIcon className="w-6 h-6 text-slate-500" />
                        </div>
                    )}
                    <span className="text-xs text-slate-600 dark:text-slate-300 truncate mx-2 flex-1" title={file.name}>{file.name}</span>
                    <button onClick={removeFile} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"><X className="w-4 h-4"/></button>
                </div>
            )}
            <div className="flex gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                    <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Nhập câu hỏi..." className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent dark:text-white" disabled={isLoading} />
                <button onClick={handleSend} disabled={(!input.trim() && !file) || isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-12">
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