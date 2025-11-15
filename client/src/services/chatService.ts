import apiClient from './apiClient';
import { ChatMessage, IChatTurn, IMessagePart } from '../class/types';

export class ChatService {

  static async sendMessage(
    channelId: string,
    message: string,
    useGoogleSearch: boolean,
    file?: File | null
  ): Promise<ChatMessage> {
    const formData = new FormData();
    formData.append('channelId', channelId);
    formData.append('message', message);
    formData.append('useGoogleSearch', String(useGoogleSearch));
    if (file) {
      formData.append('file', file);
    }
    
    // API giờ đây trả về phần model của lượt trò chuyện mới
    const newTurnPart = await apiClient.upload<{ model: { parts: IMessagePart[] } }>('/api/chat', formData);

    return {
      role: 'model',
      parts: newTurnPart.model.parts,
      timestamp: new Date()
    };
  }

  static async getHistory(channelId: string): Promise<ChatMessage[]> {
    const turns = await apiClient.get<IChatTurn[]>(`/api/chat/history/${channelId}`);
    
    const messages: ChatMessage[] = [];
    turns.forEach(turn => {
        const createdAt = turn.createdAt ? new Date(turn.createdAt) : new Date();
        if (turn.user && turn.user.parts.length > 0) {
             messages.push({
                role: 'user',
                parts: turn.user.parts,
                timestamp: createdAt,
            });
        }
       if (turn.model && turn.model.parts.length > 0) {
            messages.push({
                role: 'model',
                parts: turn.model.parts,
                timestamp: createdAt,
            });
        }
    });
    return messages;
  }

  static async clearHistory(channelId: string): Promise<void> {
    await apiClient.delete<void>(`/api/chat/history/${channelId}`);
  }
}