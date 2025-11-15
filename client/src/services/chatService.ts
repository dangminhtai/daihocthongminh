
import { ERROR_MESSAGES } from "../config/errors";

const API_BASE_URL = 'http://localhost:3001/api';

export interface ChatMessage {
  text: string;
  role: 'user' | 'model';
  timestamp: Date;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: ERROR_MESSAGES.GENERIC_ERROR }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) { // No Content
    return null as T;
  }
  return response.json();
}

export class ChatService {

  static async sendMessage(
    userId: string,
    channelId: string,
    message: string
  ): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, channelId, message }),
    });
    const data = await handleResponse<{ response: string }>(response);
    return data.response;
  }

  static async getHistory(userId: string, channelId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${API_BASE_URL}/chat/history/${userId}/${channelId}`);
    const history = await handleResponse<ChatMessage[]>(response);
    // Convert string dates to Date objects
    return history.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) }));
  }

  static async clearHistory(userId: string, channelId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chat/history/${userId}/${channelId}`, {
      method: 'DELETE',
    });
    await handleResponse<void>(response);
  }
}
