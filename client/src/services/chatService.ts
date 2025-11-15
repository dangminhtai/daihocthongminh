import apiClient from './apiClient';
import { ChatMessage, IChatTurn } from '../class/types';

export class ChatService {

  static async sendMessage(
    channelId: string,
    message: string,
    useGoogleSearch: boolean
  ): Promise<string> {
    const data = await apiClient.post<{ response: string }>('/api/chat', { channelId, message, useGoogleSearch });
    return data.response;
  }

  static async getHistory(channelId: string): Promise<ChatMessage[]> {
    const turns = await apiClient.get<IChatTurn[]>(`/api/chat/history/${channelId}`);
    
    // Chuyển đổi cấu trúc 'turns' thành danh sách 'ChatMessage' phẳng để UI dễ dàng render
    const messages: ChatMessage[] = [];
    turns.forEach(turn => {
        const createdAt = turn.createdAt ? new Date(turn.createdAt) : new Date();
        if (turn.user && turn.user.parts[0]?.text) {
             messages.push({
                role: 'user',
                text: turn.user.parts[0].text,
                timestamp: createdAt,
            });
        }
       if (turn.model && turn.model.parts[0]?.text) {
            messages.push({
                role: 'model',
                text: turn.model.parts[0].text,
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