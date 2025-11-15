import { ERROR_MESSAGES } from "../config/errors";

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (response.status === 204) {
        return null as T;
    }

    const data = await response.json();

    if (!response.ok) {
        const message = data.message || ERROR_MESSAGES.GENERIC_ERROR;
        throw new Error(message);
    }

    return data;
};

const apiClient = {
    async get<T>(endpoint: string): Promise<T> {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(endpoint, {
            method: 'GET',
            headers,
        });

        return handleResponse<T>(response);
    },

    async post<T>(endpoint: string, body: object): Promise<T> {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        return handleResponse<T>(response);
    },

    async delete<T>(endpoint: string): Promise<T> {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers,
        });

        return handleResponse<T>(response);
    }
};

export default apiClient;
