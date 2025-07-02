/* import { API_BASE_URL } from "@env"; */

const API_BASE_URL = "https://128f-189-113-33-26.ngrok-free.app"; // Replace with your actual API base URL

import AsyncStorage from "@react-native-async-storage/async-storage";
/* import {
  GlobalContextType,
  useGlobal,
} from '../components/context/GlobalContext'; */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  queryParams?: Record<string, string>;
  auth?: boolean;
}

export const useAppLogout = () => {
  /* const { setLoggedToken } = useGlobal(); */

  const appLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      /* setLoggedToken({
        accessToken: '',
        refreshToken: '',
      }); */
    } catch (error) {
      console.error("Erro ao limpar tokens:", error);
    }
  };

  return appLogout;
};
export const fetchClient = async <T>(
  endpoint: string,
  options: RequestOptions = {}
  /* globalContext?: GlobalContextType, */
): Promise<T> => {
  const {
    method = "GET",
    headers = {
      "Content-Type": "application/json",
    },
    body,
    queryParams,
    auth = false,
  } = options;
  /* const { loggedToken, setLoggedToken } = globalContext ?? useGlobal(); */

  const defaultHeaders: Record<string, string> = {
    "Content-Type": headers["Content-Type"] || "application/json",
    ...headers,
  };

  if (auth) {
    /* const accessToken = loggedToken.accessToken; */
    const accessToken = await AsyncStorage.getItem("accessToken");
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }
  let url = `${API_BASE_URL}${endpoint}`;
  if (queryParams) {
    const queryString = new URLSearchParams(queryParams).toString();
    url += `?${queryString}`;
  }
  console.log(
    "fetchClient URL:",
    url,
    "Method:",
    method,
    "Headers:",
    JSON.stringify(defaultHeaders, null, 2),
    "Body:",
    typeof body === "string" ? body : JSON.stringify(body, null, 2)
  );

  const response = await fetch(url, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 && auth) {
      // Try refreshing the token
      try {
        /* const refreshToken = loggedToken.refreshToken; */
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          /* useAppLogout(); */
          // Replace with your actual navigation logic to login
          throw new Error("Sessão expirada. Redirecionando para o login.");
        }

        const refreshData =
          headers["Content-Type"] !== "application/json"
            ? await refreshResponse
            : await refreshResponse.json();
        /* setLoggedToken({
          accessToken: refreshData.accessToken,
          refreshToken: refreshData.refreshToken,
        }); */
        await AsyncStorage.setItem("accessToken", refreshData.accessToken);
        await AsyncStorage.setItem("refreshToken", refreshData.refreshToken);

        // Retry original request with new token
        defaultHeaders["Authorization"] = `Bearer ${refreshData.accessToken}`;
        const retryResponse = await fetch(url, {
          method,
          headers: defaultHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!retryResponse.ok) {
          const retryErrorText = await retryResponse;
          throw new Error(
            `Erro 0.0: ${retryResponse.status} - ${retryErrorText}`
          );
        }

        const retryJson =
          headers["Content-Type"] !== "application/json"
            ? await retryResponse
            : await retryResponse.json();
        if (headers["Content-Type"] == "application/json") {
          console.log(
            "Response from fetchClient (retry):",
            JSON.stringify(retryJson, null, 2)
          );
        }
        if (retryJson.error) {
          throw new Error(`Erro 0.1: ${retryJson.error}`);
        }
        return retryJson;
      } catch (refreshError) {
        throw new Error(`Erro ao atualizar token: ${refreshError}`);
      }
    }
    const errorText = await response;
    console.error(
      "Erro ao fazer fetch:",
      response.status,
      errorText,
      "URL:",
      url
    );
    throw new Error(
      `Erro 0.03: ${response.status} - ${JSON.stringify(
        await response.text(),
        null,
        2
      ).toString()}`
    );
  }
  console.log("Response status:", response.status);
  const json =
    headers["Content-Type"] !== "application/json"
      ? await response
      : await response.json().catch(async (error) => {
          console.error("Erro ao fazer parse do JSON:", error);
          console.error("Response text:", await response.statusText);
          return {};
        });

  if (headers["Content-Type"] == "application/json") {
    console.log(
      "Response from fetchClient:",
      JSON.stringify(json, null, 2).toString()
    );
  }
  if (json.error) {
    throw new Error(`Erro 0.04: ${json.error}`);
  }
  return json;
};

export const fetchClientMultipart = async <T>(
  endpoint: string,
  options: Omit<RequestOptions, "headers" | "body"> & {
    body: FormData | any;
    headers?: Record<string, string>;
  }
  /*  globalContext?: GlobalContextType, */
): Promise<T> => {
  const {
    method = "POST",
    headers = {},
    body,
    queryParams,
    auth = false,
  } = options;
  console.log(
    "fetchClientMultipart called with:",
    "Endpoint:",
    endpoint,
    "Method:",
    method,
    "Headers:",

    JSON.stringify(headers, null, 2),
    "Body:",
    body ? JSON.stringify(body, null, 2) : "null",
    "QueryParams:",
    queryParams ? JSON.stringify(queryParams, null, 2) : "null"
  );
  try {
    /* const { loggedToken, setLoggedToken } = globalContext ?? useGlobal(); */
    // console.log('loggedToken', loggedToken);

    const defaultHeaders: Record<string, string> = {
      ...headers,
    };

    if (auth) {
      /* const accessToken = loggedToken.accessToken; */
      const accessToken = await AsyncStorage.getItem("accessToken");
      defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    let url = `${API_BASE_URL}${endpoint}`;
    if (queryParams) {
      const queryString = new URLSearchParams(queryParams).toString();
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body,
    });

    await new Promise((resolve) => setTimeout(resolve, 10000));

    if (!response.ok) {
      if (response.status === 401 && auth) {
        try {
          /* const refreshToken = loggedToken.refreshToken; */
          const refreshToken = await AsyncStorage.getItem("refreshToken");
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshResponse.ok) {
            /* useAppLogout(); */
            throw new Error("Sessão expirada. Redirecionando para o login.");
          }

          const refreshData =
            headers["Content-Type"] !== "application/json"
              ? await refreshResponse
              : await refreshResponse.json();
          /* setLoggedToken({
            accessToken: refreshData.accessToken,
            refreshToken: refreshData.refreshToken,
          }); */
          await AsyncStorage.setItem("accessToken", refreshData.accessToken);
          await AsyncStorage.setItem("refreshToken", refreshData.refreshToken);

          defaultHeaders["Authorization"] = `Bearer ${refreshData.accessToken}`;
          const retryResponse = await fetch(url, {
            method,
            headers: defaultHeaders,
            body,
          });

          if (!retryResponse.ok) {
            const retryErrorText = await retryResponse;
            throw new Error(
              `Erro 0.004: ${retryResponse.status} - ${retryErrorText}`
            );
          }

          const retryJson =
            headers["Content-Type"] !== "application/json"
              ? await retryResponse
              : await retryResponse.json();

          if (headers["Content-Type"] == "application/json") {
            console.log(
              "Response from fetchClientMultipart (retry):",
              JSON.stringify(retryJson, null, 2)
            );
          }
          if (retryJson.error) {
            throw new Error(`Erro 0.003: ${retryJson.error}`);
          }
          return retryJson;
        } catch (refreshError) {
          throw new Error(`Erro ao atualizar token: ${refreshError}`);
        }
      }

      const errorText = await response.text();
      throw new Error(`Erro 0.002: ${response.status} - ${errorText}`);
    }

    const json =
      headers["Content-Type"] !== "application/json"
        ? await response
        : await response.json();

    if (headers["Content-Type"] == "application/json") {
      console.log(
        "Response from fetchClientMultipart:",
        JSON.stringify(json, null, 2)
      );
    }
    if (json.error) {
      throw new Error(`Erro 0.001 : ${json.error}`);
    }
    return json;
  } catch (error) {
    console.error("Erro ao fazer fetchClientMultipart:", error);
    throw new Error(`Erro ao fazer fetchClientMultipart: ${error}`);
  }
};
