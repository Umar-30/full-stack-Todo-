/**
 * Task API Integration Layer
 *
 * Handles all API calls to the backend task management endpoints
 * Uses JWT tokens from Better Auth for authentication
 */

import { Task } from "@/types/task";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Type for creating a new task (only title required, description optional)
interface TaskCreateInput {
  title: string;
  description?: string;
}

class TaskApi {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      // Use credentials: 'include' to send cookies (Better Auth uses cookie-based sessions)
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      // Handle 204 No Content (e.g., delete responses)
      if (response.status === 204) {
        return {
          data: undefined as T,
          status: response.status,
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.detail || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
        status: 0,
      };
    }
  }

  async getTasks(userId: string, limit: number = 50, offset: number = 0): Promise<ApiResponse<{ tasks: Task[], total: number, limit: number, offset: number }>> {
    return this.request(`/api/${userId}/tasks/?limit=${limit}&offset=${offset}`);
  }

  async getTask(userId: string, taskId: string): Promise<ApiResponse<Task>> {
    return this.request(`/api/${userId}/tasks/${taskId}/`);
  }

  async createTask(userId: string, taskData: TaskCreateInput): Promise<ApiResponse<Task>> {
    return this.request(`/api/${userId}/tasks/`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(userId: string, taskId: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.request(`/api/${userId}/tasks/${taskId}/`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(userId: string, taskId: string): Promise<ApiResponse<void>> {
    return this.request(`/api/${userId}/tasks/${taskId}/`, {
      method: 'DELETE',
    });
  }

  async toggleTaskComplete(userId: string, taskId: string): Promise<ApiResponse<Task>> {
    return this.request(`/api/${userId}/tasks/${taskId}/complete/`, {
      method: 'PATCH',
    });
  }
}

export const taskApi = new TaskApi();