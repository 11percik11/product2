import { User } from "../types";
import { api } from "./api";

export type UserData = Omit<User, "id" | "createdAt" | "updatedAt">;

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<User, UserData>({
      query: (userData) => ({
        url: "/users/register",
        method: "POST",
        body: userData,
      }),
    }),
    getCurrentUsers: builder.query<User[], void>({
      query: () => ({
        url: "/current",
        method: "GET",
      }),
    }),
    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation<User, { id: string; userData: {name?: string; group?: string; company?: string; presence?: boolean } }>({
      query: ({ id, userData }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: userData,
      }),
    }),
    deleteUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useDeleteUserMutation,
  useGetCurrentUsersQuery,
  useLazyGetCurrentUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
} = userApi;

export const {
  endpoints: { deleteUser, registerUser, getCurrentUsers, getUserById, updateUser },
} = userApi;
