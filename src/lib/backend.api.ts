import { auth } from "@/lib/auth";
import axios from "axios";

class BackendApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_URL as string;
    console.log(process.env.API_URL);
  }

  private async getAuthHeaders() {
    const session = await auth();
    return {
      "Content-Type": "application/json",
      ...(session?.accessToken && {
        Authorization: `Bearer ${session.accessToken}`,
      }),
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    console.log(`${this.baseUrl}${endpoint}`);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} - ${JSON.stringify(responseData)}`
      );
    }

    return responseData;
  }

  async postFormData<T>(endpoint: string, data: any): Promise<T> {
    try {
      const session = await auth();
      const response = await axios.postForm(
        `${this.baseUrl}${endpoint}`,
        data,
        {
          headers: {
            ...(session?.accessToken && {
              Authorization: `Bearer ${session.accessToken}`,
            }),
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error?.message);
    }

    // const response = await fetch(`${this.baseUrl}${endpoint}`, {
    //   method: "POST",
    //   headers: {
    //     ...(session?.accessToken && {
    //       Authorization: `Bearer ${session.accessToken}`,
    //     }),
    //   },

    //   body: data,
    // });

    // if (!response.ok) {
    //   throw new Error(`API Error: ${response.status}`);
    // }

    // return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}

export const backendApiClient = new BackendApiClient();
