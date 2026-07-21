import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  userId: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message?: string;
  error?: string;
  access_token?: string;
  user?: User;
}

export interface News {
  id: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  publishedDate: string;
  readTime: number;
  imageUrl: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  id: string;
  title: string;
  description: string;
  department: string;
  type: string;
  purpose: string;
  requirements: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_IS_PRODUCTION === "true"
    ? process.env.NEXT_PUBLIC_BACKEND_API
    : process.env.NEXT_PUBLIC_LOCAL_API || "",
  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["News", "Career", "Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<AuthResponse, any>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    getProtectedUser: builder.query<User, void>({
      query: () => "/auth/protected",
      providesTags: ["Auth"],
    }),

    // News Endpoints
    getNews: builder.query<PaginatedResponse<News>, { page?: number; limit?: number; isAdmin?: boolean }>({
      query: (params) => ({
        url: "/news",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "News" as const, id })),
              { type: "News", id: "LIST" },
            ]
          : [{ type: "News", id: "LIST" }],
    }),
    createNews: builder.mutation<News, Partial<News>>({
      query: (body) => ({
        url: "/news",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "News", id: "LIST" }],
    }),
    updateNews: builder.mutation<News, { id: string; body: Partial<News> }>({
      query: ({ id, body }) => ({
        url: `/news/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "News", id }, { type: "News", id: "LIST" }],
    }),
    deleteNews: builder.mutation<void, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "News", id }, { type: "News", id: "LIST" }],
    }),

    // Career Endpoints
    getCareers: builder.query<PaginatedResponse<Career>, { page?: number; limit?: number; isAdmin?: boolean }>({
      query: (params) => ({
        url: "/career",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Career" as const, id })),
              { type: "Career", id: "LIST" },
            ]
          : [{ type: "Career", id: "LIST" }],
    }),
    createCareer: builder.mutation<Career, Partial<Career>>({
      query: (body) => ({
        url: "/career",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Career", id: "LIST" }],
    }),
    updateCareer: builder.mutation<Career, { id: string; body: Partial<Career> }>({
      query: ({ id, body }) => ({
        url: `/career/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Career", id }, { type: "Career", id: "LIST" }],
    }),
    deleteCareer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/career/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Career", id }, { type: "Career", id: "LIST" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProtectedUserQuery,
  useGetNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useGetCareersQuery,
  useCreateCareerMutation,
  useUpdateCareerMutation,
  useDeleteCareerMutation,
} = apiSlice;
