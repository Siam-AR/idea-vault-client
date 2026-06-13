// API utility for making requests to Express server
const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const apiCall = async (endpoint, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const apiBaseUrl = getApiBaseUrl();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let message = `Request failed with status ${response.status}`;

    if (contentType.includes("application/json")) {
      const error = await response.json();
      message = error.message || message;
    } else {
      const errorText = await response.text();
      if (errorText) {
        message = errorText;
      }
    }

    throw new Error(message);
  }

  return response.json();
};

// Authentication functions
export const authAPI = {
  register: (data) => apiCall("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  login: (data) => apiCall("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  googleLogin: (data) => apiCall("/auth/google", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  getUser: () => apiCall("/auth/user"),

  updateUser: (data) => apiCall("/auth/user", {
    method: "PATCH",
    body: JSON.stringify(data),
  }),
};

// Ideas API functions
export const ideasAPI = {
  getFeatured: () => apiCall("/ideas/featured"),

  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    return apiCall(`/ideas?${params.toString()}`);
  },

  getById: (id) => apiCall(`/ideas/${id}`),

  create: (data) => apiCall("/ideas", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  update: (id, data) => apiCall(`/ideas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }),

  delete: (id) => apiCall(`/ideas/${id}`, {
    method: "DELETE",
  }),

  getUserIdeas: () => apiCall("/user/ideas"),
};

// Comments API functions
export const commentsAPI = {
  getByIdeaId: (ideaId) => apiCall(`/comments/${ideaId}`),

  getMyComments: () => apiCall("/comments/me"),

  create: (data) => apiCall("/comments", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  update: (id, data) => apiCall(`/comments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }),

  delete: (id) => apiCall(`/comments/${id}`, {
    method: "DELETE",
  }),
};
