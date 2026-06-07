import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_API_URL || '/api';

export const taskApi = createApi({
    reducerPath: 'taskApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().user?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => {
        return {
            getTasks: builder.query({
                query: () => ({
                    url: '/tasks',
                }),
                providesTags: ['Task'],
            }),
            createTask: builder.mutation({
                query: (newTask) => ({
                    url: '/tasks',
                    method: 'POST',
                    body: newTask,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
                invalidatesTags: ['Task'],
            }),
            updateTask: builder.mutation({
                query: ({ id, ...data }) => ({
                    url: `/tasks/${id}`,
                    method: 'PUT',
                    body: data,
                }),
                invalidatesTags: ['Task'],
            }),
            deleteTask: builder.mutation({
                query: (id) => ({
                    url: `/tasks/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Task'],
            }),
        }
    }
});

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = taskApi;