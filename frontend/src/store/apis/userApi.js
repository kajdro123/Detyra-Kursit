import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



const baseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_API_URL || '/api';

export const userApi = createApi({

    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => {
        return {
            register: builder.mutation({
                query: (newUser) => ({
                    url: '/users',
                    method: 'POST',
                    body: newUser,
                })
            }),
            login: builder.mutation({
                query: (credentials) => ({
                    url: '/users/login',
                    method: 'POST',
                    body: credentials,
                }),
            }),
        }
    }
});
export const { useLoginMutation, useRegisterMutation } = userApi;



