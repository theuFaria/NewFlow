import { ApiResponse } from "@/types/apiResponse";

const url = process.env.apiUrl;
const acessToken = process.env.apiAcessToken;
const secretToken = process.env.apiSecretToken;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiRequest<T>(
  endpoint: string,
  method: HttpMethod,
  body?: string,
): Promise<ApiResponse<T>> {
  if (!url || !acessToken || !secretToken) {
    throw new Error("Variáveis de ambiente não configuradas");
  }

  const options: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      "access-token": acessToken,
      "secret-access-token": secretToken,
    },
  };

  if (body != undefined && method.toUpperCase() != "GET") {
    options.body = body;
  }

  const response = await fetch(`${url}/${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return response.json();
}
