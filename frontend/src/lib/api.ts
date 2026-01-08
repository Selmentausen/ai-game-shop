const BASE_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {

}

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
    const token = localStorage.getItem("token");
    const headers:  HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers as any,
    };
    if (token) {
        (headers as any)["Authorization"] = `Bearer ${token}`;
    }
    console.log("BASE_URL is:", BASE_URL);
    console.log("Endpoint is:", endpoint);
    const url = `${BASE_URL}${endpoint}`;
    console.log("Fetching Full URL:", url);
    const response = await fetch(url, {
        ...options,
        headers,
    });
    if (response.status === 403) {
        localStorage.removeItem("token")
        window.location.href = "/login"
    }
    return response;
}