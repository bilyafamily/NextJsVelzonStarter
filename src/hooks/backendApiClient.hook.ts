import { useSession } from "next-auth/react";

export function useBackendApiClient() {
  const { data: session } = useSession();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(session?.accessToken && {
      Authorization: `Bearer ${session.accessToken}`,
    }),
  });

  const get = async <T>(endpoint: string, params?: any): Promise<T> => {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  };

  const post = async <T>(endpoint: string, data: any): Promise<T> => {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  };

  const put = async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  };

  const postFormData = async <T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> => {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          ...(session?.accessToken && {
            Authorization: `Bearer ${session.accessToken}`,
          }),
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      return res.json();
    } catch (error: any) {
      throw new Error(error?.message);
    }
  };

  const putFormData = async <T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> => {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "PUT",
        headers: {
          ...(session?.accessToken && {
            Authorization: `Bearer ${session.accessToken}`,
          }),
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      return res.json();
    } catch (error: any) {
      console.log(error);
      throw new Error(error?.message);
    }
  };

  const patch = async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  };

  const deleteItem = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  };

  return { get, post, postFormData, putFormData, patch, put, deleteItem };
}
