import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_API_URL || '/api';

export const treatmentApi = createApi({
    reducerPath: 'treatmentApi',
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
            getTreatments: builder.query({
                query: () => ({
                    url: '/treatments',
                }),
                providesTags: ['Treatment'],
            }),
            getTreatmentById: builder.query({
                query: (id) => ({
                    url: `/treatments/${id}`,
                }),
                providesTags: ['Treatment'],
            }),
            createTreatment: builder.mutation({
                query: (newTreatment) => ({
                    url: '/treatments',
                    method: 'POST',
                    body: newTreatment,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
                invalidatesTags: ['Treatment'],
            }),
            updateTreatment: builder.mutation({
                query: ({ id, ...data }) => ({
                    url: `/treatments/${id}`,
                    method: 'PUT',
                    body: data,
                }),
                invalidatesTags: ['Treatment'],
            }),
            deleteTreatment: builder.mutation({
                query: (id) => ({
                    url: `/treatments/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Treatment'],
            }),
        };
    },
});

export const { useGetTreatmentsQuery, useGetTreatmentByIdQuery, useCreateTreatmentMutation, useUpdateTreatmentMutation, useDeleteTreatmentMutation } = treatmentApi;
