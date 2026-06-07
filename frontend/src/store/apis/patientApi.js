import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_API_URL || '/api';

export const patientApi = createApi({
    reducerPath: 'patientApi',
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
            getPatients: builder.query({
                query: () => ({
                    url: '/patients',
                }),
                providesTags: ['Patient'],
            }),
            getPatientById: builder.query({
                query: (id) => ({
                    url: `/patients/${id}`,
                }),
                providesTags: ['Patient'],
            }),
            createPatient: builder.mutation({
                query: (newPatient) => ({
                    url: '/patients',
                    method: 'POST',
                    body: newPatient,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
                invalidatesTags: ['Patient'],
            }),
            updatePatient: builder.mutation({
                query: ({ id, ...data }) => ({
                    url: `/patients/${id}`,
                    method: 'PUT',
                    body: data,
                }),
                invalidatesTags: ['Patient'],
            }),
            deletePatient: builder.mutation({
                query: (id) => ({
                    url: `/patients/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Patient'],
            }),
        };
    },
});

export const { useGetPatientsQuery, useGetPatientByIdQuery, useCreatePatientMutation, useUpdatePatientMutation, useDeletePatientMutation } = patientApi;
