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

export interface Application {
  id: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  phone: string;
  faydaNumber: string;
  dateOfBirth: string;
  birthPlace: string;
  city: string;
  kebele: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "MORE_INFO_REQUIRED";
  statusNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TrackResponse {
  applicationId: string;
  applicantName: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "MORE_INFO_REQUIRED";
  statusNotes?: string | null;
  createdAt: string;
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

export interface OpenAccountsResponse {
  data: Application[];
  meta: {
    totalItems: number;
    page: number;
    totalPages: number;
  };
  stats: {
    TOTAL: number;
    PENDING: number;
    UNDER_REVIEW: number;
    APPROVED: number;
    REJECTED: number;
    MORE_INFO_REQUIRED: number;
  };
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
  tagTypes: ["News", "Career", "Auth", "User", "Account"],
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
    getNews: builder.query<PaginatedResponse<News>, { page?: number; limit?: number; isAdmin?: boolean; status?: string }>({
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
    getNewsById: builder.query<News, string>({
      query: (id) => `/news/${id}`,
      providesTags: (result, error, id) => [{ type: "News", id }],
    }),
    createNews: builder.mutation<News, FormData | any>({
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
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "News", id }, { type: "News", id: "LIST" }],
    }),
    updateNewsImage: builder.mutation<News, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/news/${id}/image`,
        method: "PATCH",
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
    getActiveCareers: builder.query<PaginatedResponse<Career>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/career/active",
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
    getCareer: builder.query<Career, string>({
      query: (id) => `/career/${id}`,
      providesTags: (result, error, id) => [{ type: "Career", id }],
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
        method: "PATCH",
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

    // User Endpoints
    getUsers: builder.query<User[], void>({
      query: () => "/user",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ userId }) => ({ type: "User" as const, id: userId })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    createUser: builder.mutation<User, any>({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation<User, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }, { type: "User", id: "LIST" }],
    }),
    changePasswordUser: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/user/${id}/change-password`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }, { type: "User", id: "LIST" }],
    }),

    // Account (Open Account) Endpoints
    createOpenAccount: builder.mutation<{ data: Application }, any>({
      query: (body) => ({
        url: "/open-account",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Account", id: "LIST" }],
    }),
    trackOpenAccount: builder.query<{ data: TrackResponse }, string>({
      query: (applicationId) => ({
        url: "/open-account/track",
        params: { applicationId },
      }),
      providesTags: (result, error, applicationId) => [{ type: "Account", id: applicationId }],
    }),
    getOpenAccounts: builder.query<OpenAccountsResponse, { page?: number; limit?: number; search?: string; status?: string }>({
      query: (params) => ({
        url: "/open-account",
        params,
      }),
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: "Account" as const, id })),
              { type: "Account", id: "LIST" },
            ]
          : [{ type: "Account", id: "LIST" }],
    }),
    getOpenAccount: builder.query<{ data: Application }, string>({
      query: (id) => `/open-account/${id}`,
      providesTags: (result, error, id) => [{ type: "Account", id }],
    }),
    updateOpenAccount: builder.mutation<{ data: Application }, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/open-account/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Account", id }, { type: "Account", id: "LIST" }],
    }),
    deleteOpenAccount: builder.mutation<any, string>({
      query: (id) => ({
        url: `/open-account/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Account", id }, { type: "Account", id: "LIST" }],
    }),
    getOpenAccountStats: builder.query<any, void>({
      query: () => "/open-account/stats",
      providesTags: [{ type: "Account", id: "STATS" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProtectedUserQuery,
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useUpdateNewsImageMutation,
  useDeleteNewsMutation,
  useGetCareersQuery,
  useGetActiveCareersQuery,
  useGetCareerQuery,
  useCreateCareerMutation,
  useUpdateCareerMutation,
  useDeleteCareerMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useChangePasswordUserMutation,
  useDeleteUserMutation,
  useCreateOpenAccountMutation,
  useLazyTrackOpenAccountQuery,
  useTrackOpenAccountQuery,
  useGetOpenAccountsQuery,
  useGetOpenAccountQuery,
  useUpdateOpenAccountMutation,
  useDeleteOpenAccountMutation,
  useGetOpenAccountStatsQuery,
} = apiSlice;
