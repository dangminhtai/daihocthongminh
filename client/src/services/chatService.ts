import apiClient from './apiClient';

export interface ChatMessage {
  text: string;
  role: 'user' | 'model';
  timestamp: Date;
}

export class ChatService {

  static async sendMessage(
    channelId: string,
    message: string
  ): Promise<string> {
    const data = await apiClient.post<{ response: string }>('/api/chat', { channelId, message });
    return data.response;
  }

  static async getHistory(channelId: string): Promise<ChatMessage[]> {
    const history = await apiClient.get<ChatMessage[]>(`/api/chat/history/${channelId}`);
    // Chuyển đổi chuỗi ngày tháng thành đối tượng Date
    return history.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) }));
  }

  static async clearHistory(channelId: string): Promise<void> {
    await apiClient.delete<void>(`/api/chat/history/${channelId}`);
  }
}
